import axios from "axios";

export interface ICreateOrderResponseData {
    "msg": "",
    "data": {
        "min_price": 98.44,
        "max_price": 100,
        "price": "87.000",
        "fiat": "BDT",
        "nickName": "AlviBro",
        "orderId": "627bc00fa80d4252a6e89f84"
    },
    "code": 200,
    "success": true
}

export default async function getOrderId(token: string) {
    const response = await axios({
        url: "https://www.cotps.com:8443/api/mine/user/createOrder",
        method: "GET",
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "Connection": "keep-alive",
            "Content-Type": "application/json",
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
        },
    })

    const responseData = response.data as ICreateOrderResponseData;

    return responseData.data.orderId
}