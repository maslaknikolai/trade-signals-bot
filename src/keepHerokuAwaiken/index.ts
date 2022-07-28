import axios from "axios";
import express from 'express';
import { POLLING_URL, PORT, TELEGRAM_OWNER_CHAT_ID } from "../config";
import logToBot from '../botModule/logToBot';

export default function keepHerokuAwaiken() {
    if (!POLLING_URL) {
        logToBot(TELEGRAM_OWNER_CHAT_ID, 'POLLING_URL not specified');
        return
    }

    const app = express()
    const port = PORT || 8080

    app.get('/', (req, res) => {
        logToBot(TELEGRAM_OWNER_CHAT_ID, 'Ping')
        res.send('Ping')
    })

    app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })

    ping()
    setInterval(ping, 10 * 60 * 1000)
}

function ping() {
    // axios.get(POLLING_URL)
}
