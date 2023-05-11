# POAP Factory - A zkEVM POAP Minter for communities
POAP Factory is a project specifically developed for The Quest and aims to create a simple yet useful set of smart contracts to easily create POAPs. The main idea of this comes from the fact that I want to create few web3 events and the POAP will be one of the features used to introduce more people into the crypto space.

## How it works
POAP Factory is composed by two smart contracts now: the Factory and the POAP. The POAP, as you can imagine, is the contract of the POAP while the Factory is the one that is able to easily deploy and manage it. 
Each POAP can be customied and can act both as an NFT or a Soul Bound Token.
Users can get a POAP by minting it through the mint function, or by using a relayer node that will call the mintTo function specifying the address of the receiver.

## Deploy
In order to deploy POAP Factory you need to get some zkEVM ETH first. After that you can clone this repository
```
$ git clone https://github.com/ciwines/The-Quest.git
```

Then you have to install the required dependencies
```
$ npm i
```
Now you have to set up your environment variables by editing the .env file. You can use the .env.template as a starting point.

After that, you can change the relayer address in the scripts/deploy.js file (by default it's 0x0000...0000).
Last but not least, you need to deploy the smart contracts.
```
$ npx hardhat run scripts/deploy.js --network zkEVM
```

Have fun improving it and happy coding 💜.
