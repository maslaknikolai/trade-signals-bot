// ==UserScript==
// @name           cotps.com order clicker
// @version        1.0.2
// @description    Кликер ордеров
// @author         Maslak Nikolai
// @match          https://cotps.com/*
// @run-at         document-end
// @allFrames      true
// ==/UserScript==

async function start() {
    if (localStorage.stop) {
        return
    }

    console.log("[COTPS_CLICKER] Жду когда будет виден баланс.");

    const balance = await whenBalanceExists();

    if (balance < 5) {
        console.error('[COTPS_CLICKER] Баланс меньше 5. Перегрузка через 5 минут.');
        await sleep(5 * 60 * 1000);
        location.reload();
        return;
    }

    console.log("[COTPS_CLICKER] Баланс в норме.");

    const searchOrderButton = document.querySelector('.orderBtn');

    searchOrderButton.click();

    console.log("[COTPS_CLICKER] Жду открытия окна.");

    const sellButton = await whenSellButtonExists();

    console.log("[COTPS_CLICKER] Окно открыто.");

    await sleep(2000);

    console.log('[COTPS_CLICKER] Жму кнопку "Sell".');

    sellButton.click();

    console.log('[COTPS_CLICKER] Перезагрузка через 10 секунд.');

    await sleep(10 * 1000);

    console.log('[COTPS_CLICKER] Перезагрузка.');

    location.reload();
}

start();

async function whenSellButtonExists() {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const buttons = [...document.querySelectorAll('uni-button[type="primary"]')]
            const sellButton = buttons.find(btn => btn.innerText === 'Sell')

            if (sellButton) {
                resolve(sellButton)
                clearInterval(interval)
            }
        }, 1000)
    })
}

async function whenBalanceExists() {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const allDescriptions = [...document.querySelectorAll('.division-desc')]
            const balanceLabel = allDescriptions.find(el => el.innerText === 'Wallet balance')

            if (!balanceLabel) {
                return
            }

            const balanceValue = Number(balanceLabel.nextElementSibling?.innerText || 0)

            if (!balanceValue) {
                return
            }

            clearInterval(interval)
            resolve(balanceValue)
        }, 1000)
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}