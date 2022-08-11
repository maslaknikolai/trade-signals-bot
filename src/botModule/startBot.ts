import { TELEGRAM_OWNER_CHAT_ID, TELEGRAM_OWNER_LOGIN } from '../config'
import logToBot from './logToBot'
import bot from '.'
import memory from '../memory';
import onSignal from './onSignal';

export default function startBot() {
    bot.command('start', (ctx) => {
        ctx.reply(`${TELEGRAM_OWNER_LOGIN}`);
        logToBot(TELEGRAM_OWNER_CHAT_ID, `Start command recevied.\n${JSON.stringify(ctx.update.message.from, null, 2)}`)
    })

    bot.command('check', (ctx) => ctx.reply('🌚'))

    bot.command('activate_livenet', (ctx) => {
        memory.isLivenet = true
        ctx.reply(`Livenet: ${memory.isLivenet}`)
    })

    bot.command('activate_testnet', (ctx) => {
        memory.isLivenet = false
        ctx.reply(`Livenet: ${memory.isLivenet}`)
    })

    bot.on<'photo'>('photo', async (ctx) => {
        const caption = ctx.update.message.caption
        const result = await onSignal(caption)
        ctx.reply(result)
    })

    bot.on<'text'>('text', async (ctx) => {
        const text = ctx.update.message.text
        const result = await onSignal(text)
        ctx.reply(result)
    })

    bot.launch()

    logToBot(TELEGRAM_OWNER_CHAT_ID, `Включился. Активна ${memory.isLivenet ? 'боевая сеть' : 'тестовая сеть'}`)
}
