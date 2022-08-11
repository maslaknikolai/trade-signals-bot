import 'dotenv/config';
import startServer from './startServer';
import connect from './db'
import startBot from './botModule/startBot';
import messageToOrderRequestData from './messageToOrderRequestData';
import createOrder from './createOrder';

async function main() {
    startServer()
    // await connect()
    startBot()
}

main()

