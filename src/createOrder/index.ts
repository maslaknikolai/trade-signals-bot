import IOrderRequestData from "IOrderRequestData";
import { LinearClient } from 'bybit-api';
import memory from "src/memory";

function getMark(value: number | string, orderSum: number) {
  if (typeof value === 'number' || !Number.isNaN(Number(value))) {
    return Number(value)
  }

  const procent = Number(value.replace('%', ''))
  return orderSum + (orderSum * (procent / 100))
}

export default async function createOrder(orderRequestData: IOrderRequestData) {
    const useLivenet = memory.isLivenet;
    const API_KEY = useLivenet ? process.env.BYBIT_API_KEY : process.env.TEST_BYBIT_API_KEY;
    const PRIVATE_KEY = useLivenet ? process.env.BYBIT_API_SECRET : process.env.TEST_BYBIT_API_SECRET;
    const client = new LinearClient(API_KEY, PRIVATE_KEY, useLivenet);

    const symbol = `${orderRequestData.coin}USDT`
    const orderBookResult = await client.getTickers({ symbol })
    const balanceResult = await client.getWalletBalance({ coin: 'USDT' })
    const fullBalance = balanceResult.result.USDT.wallet_balance
    const wantedOrderSum = fullBalance * 0.1
    const availableBalance = balanceResult.result.USDT.available_balance
    const realOrderSum = availableBalance < wantedOrderSum ? availableBalance : wantedOrderSum;
    const lastPrice = Number(orderBookResult.result[0].last_price)
    const takeProfit = getMark(orderRequestData.takeProfit || '20%', lastPrice)
    const stopLoss = getMark(orderRequestData.stopLoss, lastPrice)
    const qty = Number((lastPrice / realOrderSum).toFixed(3))

    const params = {
      symbol,
      qty,
      side: orderRequestData.isBuy ? 'Buy' : 'Sell',
      order_type: 'Market',
      time_in_force: 'ImmediateOrCancel',
      reduce_only: false,
      close_on_trigger: false,

      take_profit: takeProfit,
      stop_loss: stopLoss,
    }

    const placeOrderResult = await client.placeActiveOrder(params)

    return placeOrderResult.result
}