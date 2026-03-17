# System Architecture

The Transparent Donation Tracker follows a three-layer architecture:

1. Frontend Layer
2. Backend Layer
3. Blockchain Layer

## Frontend

The frontend is built with React and provides the user interface for donors. It allows users to:

- Connect their MetaMask wallet
- Enter donation amounts
- View donation history
- Track donation progress

## Backend

The backend is built using Node.js and Express.js. It acts as the intermediary between the frontend and the Ethereum blockchain.

Responsibilities include:

- Processing donation requests
- Signing transactions
- Sending transactions to the blockchain

## Blockchain

The blockchain layer contains the smart contract written in Solidity.

The smart contract is responsible for:

- Receiving donations
- Recording donation transactions
- Ensuring transparency and immutability

