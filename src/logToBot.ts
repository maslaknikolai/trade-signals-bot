import { Telegraf } from 'telegraf'

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command('check', (ctx) => ctx.reply('Жив'))

export default function logToBot(msg: string) {
    const chatIds = JSON.parse(process.env.BOT_LOG_CHAT_IDS) as string[]
    chatIds.forEach((chatId)=> bot.telegram.sendMessage(chatId, msg))
}
