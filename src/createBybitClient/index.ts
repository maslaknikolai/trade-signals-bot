import { LinearClient } from 'bybit-api';
import memory from "../memory";

export default function createBybitClient() {
    const useLivenet = memory.isLivenet;
    const API_KEY = useLivenet ? process.env.BYBIT_API_KEY : process.env.TEST_BYBIT_API_KEY;
    const PRIVATE_KEY = useLivenet ? process.env.BYBIT_API_SECRET : process.env.TEST_BYBIT_API_SECRET;
    const client = new LinearClient(API_KEY, PRIVATE_KEY, useLivenet);

    return client
}