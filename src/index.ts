import { binancePrices } from './CEXPrices';
import { fetchJupiterPrice } from './DEXPrices';
import { tokens } from './token';
import dotenv from 'dotenv';
dotenv.config();

// Fee Constants
const BINANCE_FEE = 0.001; // 0.1% fee
const JUPITER_FEE = 0.003; // 0.3% fee

const calculateArbitrage = (binancePrice: number, jupiterPrice: number) => {
  const effectiveBinancePrice = binancePrice * (1 + BINANCE_FEE);
  const effectiveJupiterPrice = jupiterPrice * (1 - JUPITER_FEE);
  return effectiveJupiterPrice - effectiveBinancePrice;
};

const checkArbitrage = async () => {
  for (const token of tokens) {
    const { symbol, mintAddress, binanceSymbol } = token;

    try {
      const jupiterPrice = await fetchJupiterPrice(mintAddress);

      const binancePrice = binancePrices[binanceSymbol];
      if (binancePrice && jupiterPrice) {
        const profit = calculateArbitrage(binancePrice, jupiterPrice);
        console.log(`🚀 ${symbol} Arbitrage Opportunity: Profit = $${profit.toFixed(4)}`);
      } else {
        console.log('Missing values')
      }
    } catch (error) {
      console.error(`Error checking arbitrage for ${symbol}:`, error);
    }
  }
};

setInterval(checkArbitrage, 1 * 1000);