import 'dotenv/config';
import processAccount from './processAccount';
import credentialsItems from './credentialsItems';

function main() {
    credentialsItems.forEach(processAccount)
}

main()
setInterval(main, 5 * 60 * 1000)
