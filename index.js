import { ethers } from "./ethers-5.2.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");

balanceButton.onclick = getBalance;
connectButton.onclick = connect;
fundButton.onclick = fund;
withdrawButton.onclick = withdraw;

console.log(ethers);

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        console.log("There is a MetaMask");
        try {
            await ethereum.request({
                method: "eth_requestAccounts",
            });
            connectButton.innerHTML = "Connected";
        } catch (error) {
            console.error("Error connecting:", error.message);
            connectButton.innerHTML = "Connection failed";
        }
    } else {
        connectButton.innerHTML = "Please install MetaMask";
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const balance = await provider.getBalance(contractAddress);
            console.log(ethers.utils.formatEther(balance));
        } catch (error) {
            console.error("Error getting balance:", error.message);
        }
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value;
    console.log(`Funding with ${ethAmount}...`);
    if (typeof window.ethereum !== "undefined") {
        if (isNaN(ethAmount) || ethAmount <= 0) {
            console.error("Invalid amount. Please enter a valid number.");
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);

            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            });

            await listenForTransactionMine(transactionResponse, provider);
            console.log("Done!");
        } catch (error) {
            console.error("Error funding:", error.message);
        }
    }
}

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);

            const transactionResponse = await contract.withdraw();
            console.log(provider, signer, contract);
            await listenForTransactionMine(transactionResponse, provider);
        } catch (error) {
            console.error("Error withdrawing:", error.message);
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`);
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error("Transaction mining timed out"));
        }, 120000); // Set timeout to 2 minutes

        provider.once(transactionResponse.hash, (transactionReceipt) => {
            clearTimeout(timeout);
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations.`
            );
            resolve();
        });
    });
}
