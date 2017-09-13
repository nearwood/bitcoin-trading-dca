require('dotenv').config();


const Coinbase = require('coinbase');
const fs = require('fs');
const util = require('util');
const timestamp = () => new Date().toISOString();

const client = new Coinbase.Client({apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET});

const investmentAmount = process.env.INVESTMENT_AMOUNT;
// see full list of exhange pairs here
// https://api.kraken.com/0/public/AssetPairs
const pair = (process.env.ASSETS_PAIR || 'XXBTZEUR').toUpperCase();

const cryptoCurrency = pair.split('X')[1].slice(0, 3);
const fiatCurrency = pair.split('Z')[1].slice(0, 3);

(async () => {
    try {
        // Retrieve crypto/eur price
        const tickResponse = await client.api('Ticker', {pair});
        const cryptoPrice = tickResponse['result'][pair]['a'][0];
        if (typeof cryptoPrice === 'undefined') {
            console.log(`Unable to retrieve ${cryptoCurrency} price`);
            return;
        }
        const volumeToBuy = (investmentAmount/cryptoPrice).toFixed(6);
        const roundedInvestmentAmount = (volumeToBuy*cryptoPrice).toFixed(3);

        // Kraken does not allow to buy less than 0.002XBT
        if (volumeToBuy < 0.002) {
            console.log(`Increase your investment amount.`,
                        `You must buy at least 0.002 ${cryptoCurrency} per trade`);
            return;
        }
        const logMessage = util.format(`[${timestamp()}] Buying ${volumeToBuy} ${cryptoCurrency}`,
                                       `which is equal to ${roundedInvestmentAmount} ${fiatCurrency}`,
                                       `at price ${cryptoPrice} ${fiatCurrency}/${cryptoCurrency}\n`);
        // Log prices to file
        fs.appendFile('buy.log', logMessage, err => {
            if (err) {
                console.log('An error has occured');
                console.log(err);
                return;
            }
        });
        // buy disposed amount for today
        const tradeResponse = await client.api('AddOrder', {
            pair,
            volume: volumeToBuy,
            type: 'buy',
            ordertype: 'market'
        });
        // Retrieve and log transaction ids
        const txIds = tradeResponse['result']['txid'];
        if (typeof txIds === 'undefined') {
            console.log('Unable to read transaction ids');
            return;
        }
        console.log(util.format(`[${timestamp()}] Trade completed successfully: ${txIds}`));
    } catch (e) {
        console.log(e);
        // Log to file in case of failure
        fs.appendFile('buy.log', util.format(`[${timestamp()}] Unable to perform operation: ${e}`), err => {
            if (err) {
                console.log(err);
            }
        });
    }
})();
