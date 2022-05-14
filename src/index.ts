import 'dotenv/config';
import keepHerokuAwaiken from './keepHerokuAwaiken';
import connect from './db'
import processAccounts from './processAccounts';

async function main() {
    await connect()
    keepHerokuAwaiken()
    processAccounts()
}

main()

