import { TELEGRAM_OWNER_CHAT_ID, TELEGRAM_OWNER_LOGIN } from '../config'
import logToBot from './logToBot'
import bot from '.'

export default function startBot() {
    bot.command('start', (ctx) => {
        ctx.reply(`${TELEGRAM_OWNER_LOGIN}`);
        logToBot(TELEGRAM_OWNER_CHAT_ID, `Start command recevied.\n${JSON.stringify(ctx.update.message.from, null, 2)}`)
    })

    bot.command('check', (ctx) => ctx.reply('🌚'))

    bot.launch()
}
