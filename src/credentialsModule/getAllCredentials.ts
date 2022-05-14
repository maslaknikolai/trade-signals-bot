import CredentialItemModel from './CredentialItem.model'

export default async function getAllCredentials() {
    return CredentialItemModel.find().lean()
}