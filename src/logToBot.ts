import { Telegraf } from 'telegraf'

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command('check', (ctx) => ctx.reply('Жив'))

export default function logToBot(msg: string) {
    bot.telegram.sendMessage(process.env.BOT_LOG_CHAT_ID, msg);
}
