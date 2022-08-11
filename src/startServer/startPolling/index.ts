import axios from "axios";
import { POLLING_URL, TELEGRAM_OWNER_CHAT_ID } from "../../config";
import logToBot from '../../botModule/logToBot';

export default function startPolling() {
    if (!POLLING_URL) {
        logToBot(TELEGRAM_OWNER_CHAT_ID, 'POLLING_URL not specified');
        return
    }

    function ping() {
        axios.get(`${POLLING_URL}/ping`)
    }

    ping()
    setInterval(ping, 10 * 60 * 1000)
}
