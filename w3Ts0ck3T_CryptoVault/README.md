# HyperVault 🔐

HyperVault is a vault on blockchain in which we can deposit our funds and then we can withdraw them in exchange of the stable coins which we got in exchange of the amount we staked in the vault.

**How crypto vaults works ?**

```txt

Time T1 (initial time) :
----------------------

User : 500 XYZ (2 VLTK = 1 XYZ)

          $CRYPTO$
[USER] -------------> [Vault]
       <-------------
          $VLTK$

User : 1000 STABLECOIN (Asset returned by vault in exchange of the deposits as stable crypto)

Time T2 (after sometime) :

------------------------

User : 1000 STABLECOIN (Asset submitted to vault to get the deposited assets back which have higher value now)

          $VLTK$
[USER] ------------> [Vault]
       <------------
          $CRYPTO$

User : 500 XYZ (2.75 VLTK = 1 XYZ)

Value before lock : 1000 $VLTK$
Value after lock : 1375 $VLTK$

Profit % : (375 / 1000) * 100 = 37.5 %

CONCLUSION
----------

Here user had a profit and now owns much more worth of crypto that he/she/they owned it at time T1.

```

## Currencies Supported

The Vault supports ETH network and soon will support Cross chain.

```sh
ETH SEPOLIA
-----------------------------------------------------------
| DEPLOYED   : 0x96dA2E1A6e5FFAcf6d5bbAf55091A67caba5DC2e |
| VLTK Token : 0x0EA7bf5f7Afd9f4c176F1E9083595A8e06b06454 |
-----------------------------------------------------------

POLYGON MUMBAI (LIVE 🔴)
-----------------------------------------------------------
| DEPLOYED   : 0x165c2d5256cC3ceB26A21d72B58c03afB01dB50c |
| VLTK Token : 0xA55e2F289a08721bDfb3E727C823108a1Ac6Da39 |
-----------------------------------------------------------

# Address of price feeds (ETH)
ETH_PRICE_FEED = 0x694AA1769357215DE4FAC081bf1f309aDC325306

# Address of price feeds (POLYGON)
ETH_PRICE_FEED = 0x0715A7794a1dc8e42615F059dD6e406A6594651A
```

## Screenshots

<img src="./docs/1.png"></img>

## How to clone and contribute

- Getting the repository ready

```sh
git clone https://github.com/Arun89-crypto/CryptoVault
cd CryptoVault
```

- Setting up the dependencies (Contract)

```sh
cd cryptovault-contracts
npm i
npx hardhat compile
npx hardhat deploy
```

- Setting up the dependencies (Contract)

```sh
cd frontend
yarn
yarn dev
```

- To contribute
  - Fork the repository
  - Create new branch : `git checkout -b <branch_name>`
  - Do the changes
  - Create PR
