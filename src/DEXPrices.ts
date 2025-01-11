import axios from 'axios';
import { tokens } from './token';
import dotenv from 'dotenv';
dotenv.config();

const JUPI_API_URL = process.env.JUPI_API_URL;
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
        const response = await axios.get<JupiterPriceResponse>(JUPI_API_URL!, {
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
        for (const token of tokens){
            const price = await fetchJupiterPrice(token.mintAddress)
            console.log(`DEX ${token.binanceSymbol} : ${price}`)
        }
    }, 1 * 1000); 
};

// pollJupiterPrices()
export { fetchJupiterPrice };