import getCredentialByChatId from '../credentialsModule/getCredentialByChatId'
import setIsCredentialEnabled from '../credentialsModule/setIsCredentialEnabled'
import { Telegraf } from 'telegraf'
import { BOT_TOKEN } from '../config'

const bot = new Telegraf(BOT_TOKEN)

bot.command('check', (ctx) => ctx.reply('Жив'))

bot.command('disable', async (ctx) => {
    const chatId = ctx.update.message.chat.id;
    const credential = await getCredentialByChatId(chatId);

    if (!credential) {
        ctx.reply('Пользователь не найден')
        return
    }

    setIsCredentialEnabled(credential.id, false)

    ctx.reply('Отключено')
})

bot.command('enable', async (ctx) => {
    const chatId = ctx.update.message.chat.id;
    const credential = await getCredentialByChatId(chatId);

    if (!credential) {
        ctx.reply('Пользователь не найден')
        return
    }

    setIsCredentialEnabled(credential.id, true)

    ctx.reply('Включено')
})

bot.launch()

export default bot