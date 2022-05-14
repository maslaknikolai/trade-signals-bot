import CredentialItemModel from './CredentialItem.model'

export default async function getCredentialByChatId(telegramChatId: number) {
    return CredentialItemModel.findOne({ telegramChatId }).lean()
}