import axios from 'axios';

const JUPI_API_URL = 'https://api.jup.ag/price/v2';

const SOL_MINT_ADDRESS = 'So11111111111111111111111111111111111111112'; // SOL on Solana
const USDC_MINT_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // USDC on Solana
const USDT_MINT_ADDRESS = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'


type JupiterPriceResponse = {
    data: {
        [mintAddress: string]: {
            id: string;
            type: string;
            price: string;
        }
    };
    timeTaken: number;
};
const fetchJupiterPrice = async (tokenMintAddress: string): Promise<number | null> => {
    try {
        const response = await axios.get<JupiterPriceResponse>(JUPI_API_URL, {
            params: { 
                ids: tokenMintAddress,
                vsToken : USDT_MINT_ADDRESS
             },
        });
        const priceString = response.data.data[tokenMintAddress].price;
        return parseFloat(priceString); 
    } catch (error) {
        console.error('Error fetching Jupiter price:', error);
        return null;
    }
};

const pollJupiterPrices = async () => {
    setInterval(async () => {
        const solPrice = await fetchJupiterPrice(SOL_MINT_ADDRESS);
        const usdcPrice = await fetchJupiterPrice(USDC_MINT_ADDRESS);

        console.log(`SOL/USDT Price: $${solPrice}`);
        console.log(`USDC/USDT Price: $${usdcPrice}`);
    }, 1 * 1000); 
};

// pollJupiterPrices()
export { fetchJupiterPrice, pollJupiterPrices };