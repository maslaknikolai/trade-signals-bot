// import fs from 'fs'
import createBybitClient from '../../createBybitClient';

export default async function getKline(coin: string) {
    const client = createBybitClient()

    const klineResponse = await client.getKline({
        symbol: `${coin}USDT`,
        interval: '30',
        from: Math.round((Date.now().valueOf() - (1000 * 60 * 60 * 24 * 28 * 6)) / 1000),
        limit: 200,
    })

    // fs.writeFileSync('kline.json', JSON.stringify(klineResponse.result, null, 2))

    return klineResponse.result
}