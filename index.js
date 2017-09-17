require('dotenv').config();


const Coinbase = require('coinbase');
const fs = require('fs');
const util = require('util');
const timestamp = () => new Date().toISOString();

const client = new Coinbase.Client({apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET});

const investmentAmount = process.env.INVESTMENT_AMOUNT;
// see full list of exhange pairs here
// https://api.coinbase.com/v2/exchange-rates
const pair = (process.env.ASSETS_PAIR || 'BTC-USD').toUpperCase();
const pairSplit = pair.split('-');
const cryptoCurrency = pairSplit[0];
const fiatCurrency = pairSplit[1];

const srcAccount = process.env.SOURCE_ACCOUNT;

(async () => {
    try {
        if (!srcAccount) {
            const accounts = await client.getAccounts();
            console.error("No account specified to use for buys. Available accounts:");
            for (let i = 0; i < accounts.length; ++i) {
                console.dir(accounts[i]);
            }
            return;
        }

        const response = await client.getBuyPrice({currencyPair: pair});
		const price = response.data; //TODO check for response.error or whatever
		console.log(`${pair} @ ${price.amount} ${price.currency}`);

        const volumeToBuy = (investmentAmount / price.amount).toFixed(6);
        const roundedInvestmentAmount = (volumeToBuy * price.amount).toFixed(3);

        // Kraken does not allow to buy less than 0.002XBT
        if (volumeToBuy < 0.002) {
            console.log(`Increase your investment amount.`,
                        `You must buy at least 0.002 ${cryptoCurrency} per trade`);
            return;
        }
        const logMessage = util.format(`[${timestamp()}] Buying ${volumeToBuy} ${cryptoCurrency}`,
                                       `which is equal to ${roundedInvestmentAmount} ${fiatCurrency}`,
                                       `at price ${price.amount} ${fiatCurrency}/${cryptoCurrency}\n`);
        
        console.log(logMessage);
        fs.appendFile('buy.log', logMessage, err => {
            if (err) {
                console.error('An error has occured', err);
                return;
            }
        });

		return;

        var account = client.getAccount('');
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
