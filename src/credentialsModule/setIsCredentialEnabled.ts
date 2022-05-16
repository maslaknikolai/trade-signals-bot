import CredentialItemModel from './CredentialItem.model'

export default async function setIsCredentialEnabled(_id: string, isEnabled: boolean) {
    return CredentialItemModel.updateOne({ _id }, { isEnabled })
}