import { Telegraf } from 'telegraf'

const bot = new Telegraf(process.env.BOT_TOKEN)

export default function logToBot(msg: string) {
    bot.telegram.sendMessage(process.env.BOT_LOG_CHAT_ID, msg);
}
