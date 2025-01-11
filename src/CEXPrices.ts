import WebSocket from 'ws';

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws';

let binanceSolPrice: number | null = null;
let binanceUsdcPrice: number | null = null;

const binanceSolWebSocket = new WebSocket(`${BINANCE_WS_URL}/solusdt@ticker`);
binanceSolWebSocket.on('message', (data) => {
    const ticker = JSON.parse(data.toString());
    binanceSolPrice = parseFloat(ticker.c); 
    // console.log(`Binance SOL/USDT Price: $${binanceSolPrice}`);
});

const binanceUsdcWebSocket = new WebSocket(`${BINANCE_WS_URL}/usdcusdt@ticker`);
binanceUsdcWebSocket.on('message', (data) => {
    const ticker = JSON.parse(data.toString());
    binanceUsdcPrice = parseFloat(ticker.c); 
    // console.log(`Binance USDC/USDT Price: $${binanceUsdcPrice}`);
});


export { binanceSolPrice, binanceUsdcPrice };