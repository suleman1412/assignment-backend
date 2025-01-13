

# Arbitrage Scanner

This project identifies arbitrage opportunities between Binance (CEX) and Jupiter (DEX) for a list of specified tokens in real-time. The application uses WebSocket to broadcast profitable arbitrage opportunities to connected clients.

## Features

- **Real-Time Arbitrage Detection**: Calculates potential arbitrage profits by comparing token prices on Binance and Jupiter.
- **WebSocket Broadcasting**: Notifies all connected clients of profitable opportunities in real-time.
- **Customizable Token List**: Easily specify tokens to monitor via a configuration file or module.
- **Fee Calculation**: Accounts for trading fees on both Binance and Jupiter to ensure accurate profit calculations.

---

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/suleman1412/assignment-backend
   cd assignment-backend
   ```

2. **Install Dependencies**:
   Ensure you have [Node.js](https://nodejs.org/) installed, then run:
   ```bash
   npm i
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory with the following variables, these are just the URL of the websocket and API endpoints for the respective services:
   ```plaintext
    BINANCE_WS_URL=
    JUPI_API_URL=
   ```

---

## Usage

1. **Start the WebSocket Server**:
   ```bash
   npm run dev
   ```
   The server will start on port `8080` by default.

2. **Connect Clients**:
   Clients can connect to the WebSocket server to receive arbitrage notifications. For example:
   ```javascript
   const ws = new WebSocket('ws://localhost:8080');

   ws.onmessage = (message) => {
       console.log(JSON.parse(message.data));
   };
   ```

3. **Monitor Arbitrage Opportunities**:
   The server checks for arbitrage opportunities every second and broadcasts any profitable opportunities to all connected clients.

---

## How It Works

1. **Fetch Prices**:
   - Binance prices are fetched from `binancePrices` (provided as an imported module).
   - Jupiter prices are fetched using `fetchJupiterPrice`.

2. **Calculate Arbitrage**:
   The application calculates the potential profit by factoring in trading fees:
   ```typescript
   const calculateArbitrage = (binancePrice, jupiterPrice) => {
     const effectiveBinancePrice = binancePrice * (1 + BINANCE_FEE);
     const effectiveJupiterPrice = jupiterPrice * (1 - JUPITER_FEE);
     return effectiveBinancePrice - effectiveJupiterPrice;
   };
   ```

3. **Broadcast Results**:
   If a profit is detected, the opportunity is logged to the console and broadcast to connected WebSocket clients.

---

## Configuration

### Token List

The `tokens` array defines the tokens to monitor. Each token object should include:

- `symbol`: The token's symbol.
- `mintAddress`: The mint address for Jupiter price fetching.
- `binanceSymbol`: The corresponding Binance trading symbol.

Example:
```typescript
const tokens = [
  {
    symbol: 'SOL',
    mintAddress: 'So11111111111111111111111111111111111111112',
    binanceSymbol: 'SOLUSDT',
  },
];
```

### Fees

The trading fees are defined as constants and can be adjusted in the code:
```typescript
const BINANCE_FEE = 0.001; // 0.1% fee
const JUPITER_FEE = 0.003; // 0.3% fee
```

## Future Enhancements

- Dynamic fee configuration via environment variables or config files.
- Improved error handling for API rate limits or connectivity issues.
- Add support for other exchanges or DEX aggregators.
- Include a front-end for real-time visualization of arbitrage opportunities.

---

## Contributing

Contributions are welcome! Please fork the repository, make your changes, and open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
