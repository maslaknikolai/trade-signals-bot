import { Telegraf } from 'telegraf'
import { TELEGRAM_BOT_TOKEN } from '../config'

const bot = new Telegraf(TELEGRAM_BOT_TOKEN)

export default bot