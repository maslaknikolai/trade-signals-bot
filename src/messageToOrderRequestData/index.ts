import IOrderRequest from "IOrderRequestData"

export default function messageToOrderRequestData(message: string): null | IOrderRequest {
    const isManualOrder = !!message.match(/^man/)

    try {
        if (isManualOrder) {
            return parseManual(message)
        } else {
            return parseMessageFromRusina(message)
        }
    } catch {
        return null
    }
}

function parseManual(message: string): IOrderRequest {
    const lines = message.split('\n')
    const coin = lines.find(l => l.match('c: ')).match(/c: (.+)/)[1]
    const direction = lines.find(l => l.match('d: ')).match(/d: (.+)/)[1]
    const stopLoss = lines.find(l => l.match('sl: ')).match(/sl: (.+)/)[1]
    const takeProfit = lines.find(l => l.match('tp: ')).match(/tp: (.+)/)[1]

    return {
        coin,
        direction,
        stopLoss,
        takeProfit
    }
}

function parseMessageFromRusina(message: string) {
    const splitted = message.split('\n')

    const coin = splitted[0].split(' ')[0].substring(1).replace('/USDT', '')
    const direction = splitted[0].split(' ')[1].substring(1) === 'LONG' ? 'long' : 'short'
    const stopLoss = message.match(/Стоп - лосс: (.+)\$/)[1]

    return {
        coin,
        direction,
        stopLoss
    }
}