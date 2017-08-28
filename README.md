## Bitcoin trading using Dollar Cost Averaging strategy

This node script let you set a daily amount to invest on crypto currency (Bitcoin in this case) via the [kraken crypto exchange](https://kraken.com).

### Dollar Cost Averaging

> Dollar-cost averaging (DCA) is an investment technique of buying a fixed dollar amount of a particular investment on a regular schedule, regardless of the share price. The investor purchases more shares when prices are low and fewer shares when prices are high.

Dollar Cost Averaging has being initially used in the stock market to pursue an investment on an higher number of stocks with the same amount spend, just by investing it in a longer period of time due to the volatility of the stocks.

In the case of crypto-currency is well known that the volatility of those assets is way higher than the traditional shares purchased in the stock market. This makes the Dollar Cost Averaging strategy well suited for this type of investments.

### How you shoule chose instment amount and range
This highly depends on your risk level, in my case what I've done is setting up a total investment amount.
Let's say I want to invest 500$ and I want to spread my investment for 3 months. I also know I want to invest daily to take advantage of the volatility of the bitcoin against the dollar.

> 1000 / (3 * 30) = 1000 / 90 = ~11$ / day

I will then setup my `.env` file

```sh
KRAKEN_KEY=myKrakenKeyHere
KRAKEN_SECRET=myKrakenSecretKeyHere
INVESTMENT_AMOUNT=11.11
```

### Pre-requisites

In order to make it work you will need

- A bitcoin wallet obviously. I've used a desktop/paper wallet [Electrum](electrum.org)
- A way to exchange EUR with Bitcoins and other crypto-currencies. This repo uses [Kraken Exchange](https://kraken.com)
- [node.js 8](nodejs.org)
- [npm](https://www.npmjs.com/)

### Getting started
Once you have registered your bitcoin wallet, you have your kraken account with enough funds and you've installed node js, you can start

**Clone the project locally**
```sh
git clone github.com/0x13a/bitcoin-trading-dca && cd bitcoin-trading-dca
```

**Install the dependencies**
```sh
npm install
```

```sh
node index.js
```
