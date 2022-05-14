import CredentialItemModel from './CredentialItem.model'

export default async function setIsCredentialEnabled(credentialId: string, isEnabled: boolean) {
    return CredentialItemModel.updateOne({ id: credentialId }, { isEnabled })
}