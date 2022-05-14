import sleep from "../../utils/sleep";
import { ICredentialItem } from "../../credentialsModule/CredentialItem.model";
import getOrderId from "./getOrderId";
import getToken from "./getToken";
import sell from "./sell";
import getUserData from "./getUserData";
import logToBot from "../../botModule/logToBot";
import { TELEGRAM_OWNER_CHAT_ID } from "../../config";

export default async function processAccount(credentialItem: ICredentialItem) {
    if (!credentialItem.isEnabled) {
        return
    }

    try {
        const token = await getToken(credentialItem);

        const { balance, dealMinBalance } = await getUserData(token)

        await sleep(5000)

        let mutableBalance = balance
        while (mutableBalance > dealMinBalance) {
            const orderId = await getOrderId(token)

            await sleep(5000)
            await sell(token, orderId)
            await sleep(3000)

            const { totalBalance, balance } = await getUserData(token)

            mutableBalance = balance

            logToBot(credentialItem.telegramChatId, `Sell success.\nWallet balance: ${balance}\nTotal balance: ${totalBalance}`)

            if (credentialItem.telegramChatId !== TELEGRAM_OWNER_CHAT_ID) {
                logToBot(TELEGRAM_OWNER_CHAT_ID, `[${credentialItem.phone}] Sell success.\nWallet balance: ${balance}\nTotal balance: ${totalBalance}`)
            }
    }
    } catch(e) {
        logToBot(TELEGRAM_OWNER_CHAT_ID, `Error:\n${JSON.stringify(e, null, 4)}`)
        console.error(e);
    }
}