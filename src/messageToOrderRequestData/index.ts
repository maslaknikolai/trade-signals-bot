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
        isBuy: direction === 'long',
        stopLoss,
        takeProfit
    }
}

/* Example:
"#KLAY/USDT #LONG

Монета пробила хорошо наторгованный уровень сопротивления 0.265$.
Я ожидаю продолжение роста (тем более Биток летит).

Можно входить сейчас, можно по факту закрытия свечи выше уровня - тут каждый сам решает уже (я по текущим зашла) 👌🏽

Тейк - профиты на графике ✅

Стоп - лосс: 0.259$ ❌"
*/

function parseMessageFromRusina(message: string): IOrderRequest {
    const splitted = message.split('\n')

    const coin = splitted[0].split(' ')[0].substring(1).replace('/USDT', '')
    const direction = splitted[0].split(' ')[1].substring(1) === 'LONG' ? 'long' : 'short'
    const stopLoss = message.match(/Стоп - лосс: (.+)\$/)[1]

    return {
        coin,
        isBuy: direction === 'long',
        stopLoss
    }
}