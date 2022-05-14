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

        const { balance, dealMinBalance } = await getUserData(token)


        logToBot(`[${credentialsItem.phone}] Баланс: ${balance}`)

        await sleep(5000)

        let mutableBalance = balance
        while (mutableBalance > dealMinBalance) {
            const orderId = await getOrderId(token)
            logToBot(`[${credentialsItem.phone}] Ордер создан`)

            await sleep(5000)
            await sell(token, orderId)
            await sleep(3000)

            const { totalBalance, balance } = await getUserData(token)

            mutableBalance = balance

            logToBot(`[${credentialsItem.phone}] Продажа прошла`)
            logToBot(`[${credentialsItem.phone}] Баланс: ${balance}. Общий баланс: ${totalBalance}`)
    }
    } catch(e) {
        logToBot(`[${credentialsItem.phone}] Произошла ошибка:\n${JSON.stringify(e), null, 4}`)
        console.error(e);
    }
}