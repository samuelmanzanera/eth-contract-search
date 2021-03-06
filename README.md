
# eth-contract-search [![Build Status](https://travis-ci.org/samuelmanzanera/eth-contract-search.svg?branch=master)](https://travis-ci.org/samuelmanzanera/eth-contract-search)

[![NPM](https://nodei.co/npm/eth-contract-search.png)](https://npmjs.org/package/eth-contract-search)

List and query verified Ethereum smart contracts based on etherscan.io

## Installation
```shell
$ npm install eth-contract-search
```

## Usage

> Because Etherscan.io does not provide an CORS endpoint, the package needs to be used on NodeJS application and not browser application

Find a contract name DAO
```js
let ethContractSearch = require('eth-contract-search')
let results = await ethContractSearch.query('DAO')
```
Return:
```js
{
	"data": [
		{
			"address": "0x00000000000",
			"name": "MyContract",
			"compiler": "v0.4.21",
			"balance": "1 Ether",
			"txCount": "500",
			"verificationDate": "4/19/2018"	
		}
	],
	"pagination": {
		"next": "2",
		"last": "502"
	}
}
```

Using pagination:
```js
let resultsOnSecondPage = await ethContractSearch.query('DAO', 2)
```

## Licence

MIT
