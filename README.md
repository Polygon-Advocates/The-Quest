# ERC721 Contract with ZkProof and Verifiable Credentials from Polygon Mumbai Testnet

This project is an extension of the basic implementation of an ERC721 smart contract that requires a zero-knowledge proof (zkProof) from PolygonID before minting a new non-fungible token (NFT) on the Polygon Mumbai Testnet. In addition to the zkProof, this implementation also utilizes Verifiable Credentials issued by an issuer node to ensure the authenticity of the user's identity.

## How it Works

When a user requests to mint a new NFT, they must provide a valid zkProof generated from PolygonID and a valid Verifiable Credential issued by the issuer node. The zkProof must contain information about the user's identity and proof that they meet certain criteria specified in the contract. The Verifiable Credential must be issued by the trusted issuer node and contain verifiable information about the user's identity. Only if both the zkProof and Verifiable Credential are valid will the contract mint a new NFT and transfer ownership to the user.

**In this project it only mints you an NFT if you are born on 13-09-2003.**

## Dependencies

This project depends on the following technologies:

- Solidity: a smart contract programming language
- Hardhat: a development environment and testing framework for Ethereum
- Polygon Mumbai Testnet: a test network for the Polygon Network
- Verifiable Credentials: a standard for cryptographically verifying claims about identity and other attributes

## Getting Started

- To Issue yourself a KYC credential with birthday 13-09-2003
- Open your PolygonID App on your mobile and scan this QR
<img width="1130" alt="Screenshot 2023-05-13 at 1 36 53 AM" src="https://github.com/chiranjeev13/The-Quest/assets/44394108/785c9db3-296d-4105-9e4d-fb961bbcac39">

- You will get a notfication on your PolygonID App
- After Successfully adding the credential you should be able to see this
<img width="430" alt="" src="https://github.com/chiranjeev13/The-Quest/assets/44394108/9aff7163-a9a2-468f-9f52-6e942c392048">

- Scan this QR in the PolygonID app to get your NFT
<img width="300" alt="Screenshot 2023-05-13 at 1 56 37 AM" src="https://github.com/chiranjeev13/The-Quest/assets/44394108/bb84176a-1f65-480f-9c46-66d98085a846">

- What this does is it sends of a zkQuery which if verifies your credentials (that you were born on 13-09-2003 or not) and  will call NFT mint function call 
- View your NFT in Opensea testnet at contract address - `0x9ee2E54cFad55C7995ae3599B756D0CcfE320933`
