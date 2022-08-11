import 'dotenv/config';
import startServer from './startServer';
import connect from './db'
import startBot from './botModule/startBot';

async function main() {
    startServer()
    // await connect()
    startBot()
}

main()

