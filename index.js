require('dotenv').config();

const Kraken = require('kraken-api');
const fs = require('fs');
const util = require('util');

// set an higher timeout
const client = new Kraken(process.env.KRAKEN_KEY, process.env.KRAKEN_SECRET, {
    timeout: 60 * 60 * 48 * 1000
});
const investmentAmount = process.env.INVESTMENT_AMOUNT;

(async () => {
    try {
        // Retrieve btc/eur price 
        const tickResponse = await client.api('Ticker', {pair: 'XXBTZEUR'});
        const btcPrice = tickResponse['result']['XXBTZEUR']['a'][0];
        if (typeof btcPrice === 'undefined') {
            console.log('unable to retrieve btc price');
            return;
        }
        const btcToBuy = (investmentAmount/btcPrice).toFixed(6);
        const roundedInvestmentAmount = (btcToBuy*btcPrice).toFixed(3);
        // Kraken does not allow to buy less than 0.002XBT
        if (btcToBuy < 0.002) {
            console.log('increase your investment amount. You must buy at least 0.002 XBT per trade');
            return;
        }
        const logMessage = util.format('[%s] buying %f XBT which is equal to %f€ at price %f €/XBT\n', new Date().toISOString(), btcToBuy, roundedInvestmentAmount, btcPrice);
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
            pair: 'XBTCZEUR',
            volume: btcToBuy,
            type: 'buy',
            ordertype: 'market'
        });
        // Retrieve and log transaction ids
        const txIds = tradeResponse['result']['txid'];
        if (typeof txIds === 'undefined') {
            console.log('unable to read transaction ids');
            return;
        }
        console.log(util.format('[%s] trade completed successfully: %s', new Date().toISOString(), txIds));
    } catch (e) {
        console.log(e);
        // Log to file in case of failure
        fs.appendFile('buy.log', util.format('[%s] Unable to perform operation: %s\n', new Date().toISOString(), e), err => {
            if (err) {
                console.log(err);
            }
        });
    }
})();