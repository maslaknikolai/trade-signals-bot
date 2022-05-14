import getAllCredentials from '../credentialsModule/getAllCredentials';
import processAccount from './processAccount';

export default function processAccounts() {
    const doProcessAccounts = async () => {
        const credentialsItems = await getAllCredentials()
        credentialsItems.forEach(processAccount)
    }

    doProcessAccounts()
    setInterval(doProcessAccounts, 5 * 60 * 1000)
}