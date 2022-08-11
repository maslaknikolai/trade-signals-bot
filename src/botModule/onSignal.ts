import createOrder from '../createOrder';
import messageToOrderRequestData from '../messageToOrderRequestData';

export default async function onSignal(text: string) {
    const orderRequestData = messageToOrderRequestData(text)

    if (!orderRequestData) {
        return '💩 Не удалось распарсить'
    }

    try {
        const result = await createOrder(orderRequestData)
        return JSON.stringify(result, null, 4)
    } catch (e) {
        return JSON.stringify(e, null, 4)
    }
}