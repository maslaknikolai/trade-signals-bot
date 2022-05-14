import axios from "axios";
import express from 'express';
import { HEROKU_APP_URL, PORT, TELEGRAM_OWNER_CHAT_ID } from "../config";
import logToBot from '../botModule/logToBot';

export default function keepHerokuAwaiken() {
    if (!HEROKU_APP_URL) {
        logToBot(TELEGRAM_OWNER_CHAT_ID, 'Не задан HEROKU_APP_URL. Оживления не будет');
        return
    }

    const app = express()
    const port = PORT || 8080

    app.get('/', (req, res) => {
        logToBot(TELEGRAM_OWNER_CHAT_ID, 'Пинг')
        res.send('Пинг')
    })

    app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })

    ping()
    setInterval(ping, 10 * 60 * 1000)
}

function ping() {
    axios.get(HEROKU_APP_URL)
}
