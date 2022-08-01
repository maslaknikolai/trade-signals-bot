import 'dotenv/config';
import keepHerokuAwaiken from './keepHerokuAwaiken';
import connect from './db'
import startBot from './botModule/startBot';
import messageToOrderRequestData from './messageToOrderRequestData';
import createOrder from './createOrder';

async function main() {
    keepHerokuAwaiken()
    // await connect()
    startBot()
}

main()

