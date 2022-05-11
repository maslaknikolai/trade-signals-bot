import sleep from "../utils/sleep";
import ICredentialsItem from "../types/ICredentialsItem";
import getOrderId from "./getOrderId";
import getToken from "./getToken";
import sell from "./sell";
import getBalance from "./getBalance";
import logToBot from "../logToBot";

export default async function processAccount(credentialsItem: ICredentialsItem) {
    try {
        const token = await getToken(credentialsItem);

        logToBot(`Авторизован ${credentialsItem.phone}`)

        let balance = await getBalance(token)

        logToBot(`Баланс ${balance}`)

        await sleep(5000)

        while (balance > 5) {
            const orderId = await getOrderId(token)
            logToBot(`Ордер создан ${orderId}`)
            await sleep(5000)
            sell(token, orderId)
            balance = await getBalance(token)
            logToBot(`Продажа прошла ${orderId}.`)
        }
    } catch(e) {
        console.error(e);
    }
}