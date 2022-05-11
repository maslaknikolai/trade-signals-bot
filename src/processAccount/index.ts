import sleep from "../utils/sleep";
import ICredentialsItem from "../types/ICredentialsItem";
import getOrderId from "./getOrderId";
import getToken from "./getToken";
import sell from "./sell";
import getBalance from "./getBalance";

export default async function processAccount(credentialsItem: ICredentialsItem) {
    try {
        const token = await getToken(credentialsItem);
        const balance = await getBalance(token)

        await sleep(5000)

        while (balance > 5) {
            const orderId = await getOrderId(token)
            await sleep(5000)
            sell(token, orderId)
        }
    } catch(e) {
        console.error(e);
    }
}