// ==UserScript==
// @name           cotps.com order clicker
// @version        1.0.2
// @description    Кликер ордеров
// @author         Maslak Nikolai
// @include        https://cotps.com/*
// @grant          GM.xmlHttpRequest
// @grant          GM_xmlhttpRequest
// @grant          GM_download
// @grant          GM_info
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_addValueChangeListener
// @grant          GM_notification
// @grant          GM.setValue
// @grant          GM.getValue
// @grant          GM.deleteValue
// @grant          GM.listValues
// @grant          unsafeWindow
// @grant          GM.addValueChangeListener
// @run-at         document-end
// @allFrames      true
// ==/UserScript==

async function start() {
    if (localStorage.stop) {
        return
    }

    await sleep(3000)

    const balanceLabel = [...document.querySelectorAll('.division-desc')].find(el => el.innerText === 'Wallet balance')

    if (!balanceLabel) {
        console.error('Не вижу баланс');
        await sleep(10 * 1000)
        location.reload()
        return
    }

    const balance = Number(balanceLabel.nextElementSibling.innerText)

    if (balance < 5) {
        console.error('Баланс меньше 5. Проверка через 5 минут.');
        await sleep(5 * 60 * 1000)
        location.reload()
        return
    }

    await makeOrder()
    await sleep(10 * 1000)

    location.reload()
}

start()

async function makeOrder() {
    const searchOrderButton = document.querySelector('.orderBtn')
    if (!searchOrderButton) {
        console.error('No order button');
        return
    }

    searchOrderButton.click();

    const sellButton = await whenSellButtonExists()

    await sleep(2000)

    sellButton.click()
}

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}