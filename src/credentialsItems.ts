import ICredentialsItem from "./types/ICredentialsItem"

const phones = JSON.parse(process.env.PHONES!) as string[]
const passwords = JSON.parse(process.env.PASSWORDS!) as string[]

const credentialsItems: ICredentialsItem[] = phones.map((phone, i) => ({
    phone,
    password: passwords[i]
}))

export default credentialsItems