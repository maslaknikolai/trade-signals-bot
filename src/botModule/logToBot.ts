import bot from ".";

export default function logToBot(chatId: string, msg: string) {
    bot.telegram.sendMessage(chatId, msg)
}
