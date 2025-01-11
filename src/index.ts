import { binanceSolPrice, binanceUsdcPrice } from './CEXPrices';
import { fetchJupiterPrice } from './DEXPrices';

// Fee Constants
const BINANCE_FEE = 0.001;
const JUPITER_FEE = 0.003; 

// MINT ADDRESSES
const SOL_MINT_ADDRESS = 'So11111111111111111111111111111111111111112'; // SOL on Solana
const USDC_MINT_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // USDC on Solana

const calculateArbitrage = (binancePrice: number, jupiterPrice: number) => {
  const effectiveBinancePrice = binancePrice * (1 + BINANCE_FEE);
  const effectiveJupiterPrice = jupiterPrice * (1 - JUPITER_FEE);
  return effectiveJupiterPrice - effectiveBinancePrice;
};

const checkArbitrage = async () => {
  const jupiterSolPrice = await fetchJupiterPrice(SOL_MINT_ADDRESS);
  const jupiterUSDCPrice = await fetchJupiterPrice(USDC_MINT_ADDRESS);
  
  if (binanceSolPrice && jupiterSolPrice) {
    const profit = calculateArbitrage(binanceSolPrice, jupiterSolPrice);
    console.log(`SOL Arbitrage Opportunity: Profit = $${profit.toFixed(4)}`);
  }
  
  if (binanceUsdcPrice && jupiterUSDCPrice) {
    const profit = calculateArbitrage(binanceUsdcPrice, jupiterUSDCPrice);
    console.log(`USDC Arbitrage Opportunity: Profit = $${profit.toFixed(4)}`);
  }
};

setInterval(checkArbitrage, 10 * 1000);