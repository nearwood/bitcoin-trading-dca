require('dotenv').config();


const Coinbase = require('coinbase');
const fs = require('fs');
const EOL = require('os').EOL;
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

let paymentMethod = process.env.PAYMENT_METHOD;
let account = process.env.ACCOUNT;

(async () => {
    try {
        if (!account) {
            const accounts = await client.getAccounts();
            console.error("No account specified to use for buys. Available accounts:");
            for (let i = 0; i < accounts.length; ++i) {
                let a = accounts[i];
                console.log(`Name: ${a.name}, primary: ${a.primary}, type: ${a.type}, currency: ${a.currency}, balance: ${a.balance.amount} id: ${a.id}`);
            }
            return;
        } else {
            account = await client.getAccount(account);
            console.log(`Using account: ${account.name} - ${account.balance.amount} ${account.balance.currency} (${account.native_balance.amount} ${account.native_balance.currency})`);
        }

        let paymentMethods = await client.getPaymentMethods();

        if (!paymentMethod) {
            console.error("No payment method specified to use for buys. Available methods:");
        }

        for (let i = 0; i < paymentMethods.length; ++i) {
            let m = paymentMethods[i];
            if (!paymentMethod) {
                console.log(`Name: ${m.name}, type: ${m.type}, currency: ${m.currency}, id: ${m.id}`);
            } else if (m.type == paymentMethod || m.id == paymentMethod) {
                paymentMethod = m.id;
                console.log(`Using payment method: ${m.type}, ${m.name}`);
                //TODO Show balance if linked to account?
            }
        }

        if (!paymentMethod) {
            return;
        }

        const response = await client.getBuyPrice({currencyPair: pair});
		const price = response.data; //TODO check for response.error or whatever
		console.log(`${pair} @ ${price.amount} ${price.currency}`);

        const volumeToBuy = (investmentAmount / price.amount).toFixed(6);
        const roundedInvestmentAmount = (volumeToBuy * price.amount).toFixed(3);

        //TODO Check Coinbase minimums
        if (volumeToBuy < 0.002) {
            console.log(`Increase your investment amount. You must buy at least 0.002 ${cryptoCurrency} per trade`);
            return;
        }
        const logMessage = `[${timestamp()}] Buy ${volumeToBuy} ${cryptoCurrency} * ${price.amount} ${fiatCurrency}/${cryptoCurrency} = ${roundedInvestmentAmount} ${fiatCurrency}`;
        console.log(logMessage);
        fs.appendFile('buy.log', logMessage + EOL, err => {
            if (err) {
                console.error('An error has occured', err);
                return;
            }
        });

        const tradeResponse = await account.buy({
            amount: volumeToBuy,
            currency: cryptoCurrency,
            payment_method: paymentMethod,
            quote: true
        });
        
        console.dir(tradeResponse);
        //console.log(util.format(`[${timestamp()}] Trade completed successfully: ${txIds}`));
    } catch (e) {
        console.error(e);
        // Log to file in case of failure
        fs.appendFile('buy.log', `[${timestamp()}] Unable to perform operation: ${e}` + EOL, err => {
            if (err) {
                console.error("Unable to append error to log:", err);
            }
        });
    }
})();
