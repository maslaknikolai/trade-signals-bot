import 'dotenv/config';
import keepHerokuAwaiken from './keepHerokuAwaiken';
import connect from './db'
import startBot from './botModule/startBot';
import messageToOrderRequestData from './messageToOrderRequestData';

async function main() {
    keepHerokuAwaiken()
    // await connect()
    startBot({
        onMessage: (text: string, reply) => {
            const orderRequestData = messageToOrderRequestData(text)

            reply(JSON.stringify(orderRequestData, null, 2));
        }
    })
}

main()

