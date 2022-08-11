import 'dotenv/config';
import keepHerokuAwaiken from '../src/keepHerokuAwaiken';
import connect from '../src/db'
import startBot from '../src/botModule/startBot';
import createOrder from '../src/createOrder';
import getKline from '../src/startServer/getKline';

async function main() {
    // keepHerokuAwaiken()
    // await connect()
    // createOrder({
    //     coin: 'BTC',
    //     isBuy: true,
    //     stopLoss: '-20%',
    // })

    getKline('FTM')
}

main()