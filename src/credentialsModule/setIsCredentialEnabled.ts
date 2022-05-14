import CredentialItemModel from './CredentialItem.model'

export default async function setIsCredentialEnabled(credentialId: number, isEnabled: boolean) {
    return CredentialItemModel.updateOne({ id: credentialId }, { isEnabled })
}