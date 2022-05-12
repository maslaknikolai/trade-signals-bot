import axios from "axios";

interface IResponse {
    "success": true,
    "userinfo": {
        "total_balance": string
        "freeze_balance": string
        "balance": string
        "min_times": number,
        "max_times": number,
        "submit_min_times": number,
        "submit_max_times": number,
        "deal_min_balance": number
    },
    "deal": {
        "count": number,
        "profit": number,
        "price": number
    }
}

export default async function getBalance(token: string) {
    const response = await axios({
        url: "https://www.cotps.com:8443/api/mine/user/getDealInfo",
        method: "GET",
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "Connection": "keep-alive",
            "Host": "www.cotps.com:8443",
            "Origin": "https://cotps.com",
            "Referer": "https://cotps.com/",
            "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36",
            "authorization": `Bearer ${token}`
        }
    })

    const responseData = response.data as IResponse

    return {
        balance: Number(responseData.userinfo.balance),
        totalBalance: responseData.userinfo.total_balance
    };
}