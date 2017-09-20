## Bitcoin investing using Dollar Cost Averaging strategy

Based off of: [0x13a's original Kraken version](https://github.com/0x13a/bitcoin-trading-dca)

This node script let you set a daily amount to invest on crypto currency (Bitcoin in this case) via the [Coinbase crypto exchange](https://coinbase.com).

This version uses Coinbase's API. Coinbase's fees make DCA cost-prohbitive for small amounts (less than $250 using ACH/fiat balance, or less than $80 with a credit card). See fee schedule below. Also consider using a credit card with cashback, if you can pay it off to avoid carrying a balance, you can significantly reduce the effective fees:

| Amount  | ACH/Bank | ACH Fee | Credit Card | CC Fee | 3% Cashback |
|---------|----------|---------|-------------|--------|---------------|
| $10.00  | $0.99    | 9.90%   | $0.99       | 9.90%  | 6.90%         |
| $20.00  | $1.49    | 7.45%   | $1.49       | 7.45%  | 4.45%         |
| $40.00  | $1.99    | 4.98%   | $1.99       | 4.98%  | 1.98%         |
| $50.00  | $1.99    | 3.98%   | $1.99       | 3.98%  | 0.98%         |
| $60.00  | $2.99    | 4.98%   | $2.99       | 4.98%  | 1.98%         |
| $75.00  | $2.99    | 3.99%   | $2.99       | 3.99%  | 0.99%         |
| $80.00  | $2.99    | 3.74%   | $3.07       | 3.84%  | 0.84%         |
| $100.00 | $2.99    | 2.99%   | $3.84       | 3.84%  | 0.84%         |
| $150.00 | $2.99    | 1.99%   | $5.76       | 3.84%  | 0.84%         |
| $162.50 | $2.99    | 1.84%   | $6.23       | 3.83%  | 0.83%         |
| $175.00 | $2.99    | 1.71%   | $6.71       | 3.83%  | 0.83%         |
| $187.50 | $2.99    | 1.59%   | $7.19       | 3.83%  | 0.83%         |
| $200.00 | $2.99    | 1.50%   | $7.67       | 3.84%  | 0.84%         |
| $250.00 | $3.72    | 1.49%   | $9.59       | 3.84%  | 0.84%         |

You can also setup recurring buys from their website. However, this allows the same functionality and can keep better track of your average cost-per-coin over time.

### Dollar Cost Averaging

> Dollar-cost averaging (DCA) is an investment technique of buying a fixed dollar amount of a particular investment on a regular schedule, regardless of the share price. The investor purchases more shares when prices are low and fewer shares when prices are high.

Dollar Cost Averaging has being initially used in the stock market to pursue an investment on an higher number of stocks with the same amount spend, just by investing it in a longer period of time due to the volatility of the stocks.

In the case of crypto-currency is well known that the volatility of those assets is way higher than the traditional shares purchased in the stock market. This makes the Dollar Cost Averaging strategy well suited for this type of investments.

### How you should choose investment amount and range
This highly depends on your risk level, in my case what I've done is set up a total investment amount.
Let's say I want to invest 1000$ and I want to spread my investment for 3 months. I also know I want to invest daily to take advantage of the volatility of the bitcoin against the dollar.

> 1000 / (3 * 30) = 1000 / 90 = ~11$ / day

I will then setup my `.env` file

```sh
API_KEY=myCoinbaseKeyHere
API_SECRET=myCoinbaseSecretHere
INVESTMENT_AMOUNT=11.11
ASSETS_PAIR=BTC-USD
```

### Pre-requisites

In order to make it work you will need

- A bitcoin wallet obviously. I've used a desktop/paper wallet [Electrum](https://electrum.org)
- A way to exchange EUR with Bitcoins and other crypto-currencies. This repo uses [Coinbase](https://coinbase.com)
- [node.js 8](https://nodejs.org)
- [npm](https://www.npmjs.com/)

### Getting started
Once you have registered your bitcoin wallet, you have your exchange account with enough funds and you've installed node js, you can start

**Clone the project locally**
```sh
git clone github.com/nearwood/bitcoin-trading-dca && cd bitcoin-trading-dca
```

**Install the dependencies**
```sh
npm install
```

**Run**

This should be run once a day, every day, after lunch **or** setup a [cronjob](https://www.cyberciti.biz/faq/how-do-i-add-jobs-to-cron-under-linux-or-unix-oses/) that runs it for you every day
```sh
node index.js
```

### Disclaimer

Dollar Cost Averaging is meant to be used as a long-term strategy. This does not mean that returns are guaranteed, it's an investment and it's on your own risk. The general idea of this is to be used as [Buy, hold and don't watch too closely](https://www.cnbc.com/2016/03/04/warren-buffett-buy-hold-and-dont-watch-too-closely.html)
