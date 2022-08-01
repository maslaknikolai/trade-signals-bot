import { TELEGRAM_OWNER_CHAT_ID, TELEGRAM_OWNER_LOGIN } from '../config'
import logToBot from './logToBot'
import bot from '.'
import createOrder from '../createOrder';
import messageToOrderRequestData from '../messageToOrderRequestData';
import memory from '../memory';

export default function startBot() {
    bot.command('start', (ctx) => {
        ctx.reply(`${TELEGRAM_OWNER_LOGIN}`);
        logToBot(TELEGRAM_OWNER_CHAT_ID, `Start command recevied.\n${JSON.stringify(ctx.update.message.from, null, 2)}`)
    })

    bot.command('check', (ctx) => ctx.reply('🌚'))
    bot.command('activateLivenet', (ctx) => {
        memory.isLivenet = true
        ctx.reply(`${memory.isLivenet}`)
    })
    bot.command('activateTestnet', (ctx) => {
        memory.isLivenet = false
        ctx.reply(`${memory.isLivenet}`)
    })

    bot.on<'photo'>('photo', async (ctx) => {
        const caption = ctx.update.message.caption

        const orderRequestData = messageToOrderRequestData(caption)

        if (!orderRequestData) {
            ctx.reply('💩 Не удалось распарсить')
            return
        }

        const res = await createOrder(orderRequestData)

        ctx.reply(JSON.stringify(res, null, 4))
    })

    bot.on<'text'>('text', async (ctx) => {
        const text = ctx.update.message.text

        const orderRequestData = messageToOrderRequestData(text)

        if (!orderRequestData) {
            ctx.reply('💩 Не удалось распарсить')
            return
        }

        const res = await createOrder(orderRequestData)

        ctx.reply(JSON.stringify(res, null, 4))
    })

    bot.launch()

    logToBot(TELEGRAM_OWNER_CHAT_ID, `Включился. Активна ${memory.isLivenet ? 'боевая сеть' : 'тестовая сеть'}`)
}
