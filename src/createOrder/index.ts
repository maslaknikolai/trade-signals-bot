import IOrderRequestData from "IOrderRequestData";
import createBybitClient from "../createBybitClient";

function getMark(value: number | string, orderSum: number) {
  if (typeof value === 'number' || !Number.isNaN(Number(value))) {
    return Number(value)
  }

  const procent = Number(value.replace('%', ''))
  const result = orderSum + (orderSum * (procent / 100))

  return Number(result.toFixed(4))
}

export default async function createOrder(orderRequestData: IOrderRequestData) {
    const client = createBybitClient()

    const symbol = `${orderRequestData.coin}USDT`
    const tickersResult = await client.getTickers({ symbol })
    const balanceResult = await client.getWalletBalance({ coin: 'USDT' })
    const fullBalance = balanceResult.result.USDT.wallet_balance
    const wantedSumForOrder = fullBalance * 0.1
    const availableBalance = balanceResult.result.USDT.available_balance
    const sumForOrder = availableBalance < wantedSumForOrder ? availableBalance : wantedSumForOrder;
    const lastCoinPrice = Number(tickersResult.result[0].last_price)
    const takeProfit = getMark(orderRequestData.takeProfit || '20%', lastCoinPrice)
    const stopLoss = getMark(orderRequestData.stopLoss, lastCoinPrice)
    const qty = Number((sumForOrder / lastCoinPrice).toFixed(3))
    const side = orderRequestData.isBuy ? 'Buy' : 'Sell'

    const orderParams = {
      symbol,
      qty,
      side,
      order_type: 'Market',
      time_in_force: 'ImmediateOrCancel',
      reduce_only: false,
      close_on_trigger: false,

      take_profit: takeProfit,
      stop_loss: stopLoss,
    }

    const placeOrderResult = await client.placeActiveOrder(orderParams)

    return placeOrderResult
}