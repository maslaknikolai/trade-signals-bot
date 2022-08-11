import express from 'express';
import path from 'path';
import {PORT} from "../config";
import getKline from './getKline';
import cors from 'cors';
import startPolling from './startPolling';

export default function startServer() {
    const app = express()
    const port = PORT || 8080

    app.use(cors())
    app.use(express.static(path.join(__dirname, `/../../static`)))

    app.get('/ping', (req, res) => {
        res.send('Ping')
    })

    app.get('/kline/:coin', async (req, res) => {
        res.json(await getKline(req.params.coin))
    })

    app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })

    startPolling()
}
