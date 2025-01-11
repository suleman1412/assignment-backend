import WebSocket from 'ws';
import { tokens } from './token';
import dotenv from 'dotenv';

dotenv.config();

const BINANCE_WS_URL = process.env.BINANCE_WS_URL || 'wss://stream.binance.com:9443/ws';

const binancePrices: { [symbol: string]: number | null } = {};

// Track existing WebSocket connections
const existingSymbols: Set<string> = new Set();

// Set up WebSocket for a symbol and store its price
const setupBinanceWebSocket = (symbol: string) => {
  if (existingSymbols.has(symbol)) {
    return; // Avoid duplicate connections
  }

  const binanceSymbol = symbol.toLowerCase();
  const binanceWebSocket = new WebSocket(`${BINANCE_WS_URL}/${binanceSymbol}@ticker`);

  binanceWebSocket.on('message', (data) => {
    const ticker = JSON.parse(data.toString());
    binancePrices[symbol] = parseFloat(ticker.c); 
    // console.log(`Binance ${symbol}: $${binancePrices[symbol]}`);
  });

  binanceWebSocket.on('error', (error) => {
    console.error(`WebSocket error for ${symbol}:`, error);
  });

  binanceWebSocket.on('close', () => {
    console.log(`WebSocket closed for ${symbol}. Reconnecting...`);
    existingSymbols.delete(symbol); // Allow reconnection
    setupBinanceWebSocket(symbol); 
  });

  existingSymbols.add(symbol); // Mark symbol as connected
};

// Poll Binance prices for all tokens
const pollBinancePrices = () => {
  for (const token of tokens) {
    setupBinanceWebSocket(token.binanceSymbol); // Set up WebSocket for each token
  }
};

// Start polling Binance prices
pollBinancePrices();

// Export the prices object
export { binancePrices };