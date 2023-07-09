# smartContract-basic-web-01

The provided JavaScript project utilizes the ethers.js library to interact with an Ethereum smart contract. It enables users to connect their Metamask wallet, check the balance of a specific contract address, fund the contract with Ether, and initiate a withdrawal.

The project includes the following key functions:

Connect: Allows users to connect their Metamask wallet, granting access to their Ethereum accounts.

Get Balance: Retrieves and logs the balance of the specified contract address using the user's Metamask provider.

Fund: Lets users specify an amount of Ether to fund the contract. It connects to Metamask, obtains a signer, creates a contract instance,
calls the fund function, and waits for the transaction to be mined.

Withdraw: Enables users to initiate a withdrawal from the contract. It follows a similar process as the funding operation, waiting for the transaction to be mined.
