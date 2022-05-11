import axios from "axios";
import express from 'express';
import logToBot from '../logToBot';

export default function keepHerokuAwaiken() {
    if (!process.env.HEROKU_APP_URL) {
        logToBot('Не задан HEROKU_APP_URL. Оживления не будет');
        return
    }

    const app = express()
    const port = process.env.PORT || 8080

    app.get('/', (req, res) => {
        logToBot('Пинг')
        res.send('Пинг')
    })

    app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })

    ping()
    setInterval(ping, 10 * 60 * 1000)
}

function ping() {
    axios.get(process.env.HEROKU_APP_URL)
}
