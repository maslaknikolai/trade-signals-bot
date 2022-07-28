import 'dotenv/config';
import keepHerokuAwaiken from './keepHerokuAwaiken';
import connect from './db'
import processAccounts from './processAccounts';
import startBot from './botModule/startBot';

async function main() {
    keepHerokuAwaiken()
    await connect()
    startBot()
    processAccounts()
}

main()

