import sleep from "../utils/sleep";
import ICredentialsItem from "../types/ICredentialsItem";
import getOrderId from "./getOrderId";
import getToken from "./getToken";
import sell from "./sell";
import getUserData from "./getUserData";
import logToBot from "../logToBot";

export default async function processAccount(credentialsItem: ICredentialsItem) {
    try {
        const token = await getToken(credentialsItem);

        logToBot(`[${credentialsItem.phone}] Авторизован`)

        const userData = await getUserData(token)
        let balance = userData.balance

        logToBot(`[${credentialsItem.phone}] Баланс: ${balance}`)

        await sleep(5000)

        while (balance > 5) {
            const orderId = await getOrderId(token)
            logToBot(`[${credentialsItem.phone}] Ордер создан`)

            await sleep(5000)
            await sell(token, orderId)
            await sleep(3000)

            const userData = await getUserData(token)
            const profit = userData.profit

            balance = userData.balance

            logToBot(`[${credentialsItem.phone}] Продажа прошла`)
            logToBot(`[${credentialsItem.phone}] Баланс: ${balance}. Общая прибыль: ${profit}`)
    }
    } catch(e) {
        console.error(e);
    }
}