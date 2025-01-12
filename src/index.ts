import WebSocket from 'ws';
import { binancePrices } from './CEXPrices';
import { fetchJupiterPrice } from './DEXPrices';
import { tokens } from './token';
import dotenv from 'dotenv';

dotenv.config();

interface result {
  symbol: string;
  profit: number;
}


// Fee Constants
const BINANCE_FEE = 0.001; // 0.1% fee
const JUPITER_FEE = 0.003; // 0.3% fee

const calculateArbitrage = (binancePrice:number, jupiterPrice:number) => {
  const effectiveBinancePrice = binancePrice * (1 + BINANCE_FEE);
  const effectiveJupiterPrice = jupiterPrice * (1 - JUPITER_FEE);
  return effectiveBinancePrice - effectiveJupiterPrice;
};

// Set up WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('close', () => console.log('Client disconnected'));
});

const broadcastData = (data: result) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

const checkArbitrage = async () => {
  for (const token of tokens) {
    const { symbol, mintAddress, binanceSymbol } = token;

    try {
      const jupiterPrice = await fetchJupiterPrice(mintAddress);
      const binancePrice = binancePrices[binanceSymbol];

      if (binancePrice && jupiterPrice) {
        const profit = calculateArbitrage(binancePrice, jupiterPrice);
        const result: result = {
          symbol,
          profit: parseFloat(profit.toFixed(4)),
        };
        if(profit > 0){
          console.log(`${symbol} Arbitrage Opportunity: Profit = $${profit.toFixed(4)}`);
          broadcastData(result);
        }

      } else {
        console.log('Missing values');
      }
    } catch (error) {
      console.error(`Error checking arbitrage for ${symbol}:`, error);
    }
  }
};

setInterval(checkArbitrage, 1 * 1000);
