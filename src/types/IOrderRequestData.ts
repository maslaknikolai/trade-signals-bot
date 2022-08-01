export default interface IOrderRequestData {
    coin: string
    isBuy: boolean
    // examples: '10%', '0.0345'
    stopLoss: number | string
    // examples: '10%', '0.0345'
    takeProfit?: number | string
}