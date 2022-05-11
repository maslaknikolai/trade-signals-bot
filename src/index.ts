import 'dotenv/config';
import processAccount from './processAccount';
import credentialsItems from './credentialsItems';
import keepHerokuAwaiken from './keepHerokuAwaiken';

function main() {
    keepHerokuAwaiken()
    credentialsItems.forEach(processAccount)
}

main()
setInterval(main, 5 * 60 * 1000)
