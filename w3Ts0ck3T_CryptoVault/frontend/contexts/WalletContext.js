import React, { useState, createContext } from "react";
import { ethers } from "ethers";

export const WalletContext = createContext();

let Eth;

if (typeof window !== 'undefined') {
    Eth = window.ethereum;
} else {
    console.log("window.ethereum is not found");
}



export const WalletProvider = ({ children }) => {
    const [currentAddress, setCurrentAddress] = useState("");
    const [currentBalance, setCurrentBalance] = useState(0.0);

    // (Eth) && window.ethereum.on('accountsChanged', async (accounts) => {
    //     try {
    //         setCurrentAccount(accounts[0])
    //     } catch (error) {
    //         console.log(error);
    //     }
    // })

    const checkIfWalletIsConnected = async () => {
        if (!Eth) return;
        try {
            const addressArray = await Eth.request({
                method: "eth_accounts",
            });
            if (addressArray.length > 0) {
                setCurrentAddress(addressArray[0]);
            } else {
                console.log("Wallet not connected");
                return;
            }
        } catch (err) {
            console.log(err);
        }
    };

    const getAccountBalance = async () => {
        try {
            if (!Eth) return alert("Please install metamask");
            const balance = await Eth.request({ method: 'eth_getBalance', params: [currentAddress, 'latest'] });
            setCurrentBalance(parseFloat(ethers.utils.formatEther(balance)).toFixed(4));
        } catch (error) {
            console.log(error);
        }
    }

    const connectWallet = async () => {
        if (!Eth) return alert("Please install metamask");
        try {
            const addressArray = await Eth.request({
                method: 'eth_requestAccounts',
            })
            if (addressArray.length > 0) {
                setCurrentAddress(addressArray[0]);
                getAccountBalance();
            } else {
                return;
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <WalletContext.Provider value={{
            connectWallet,
            checkIfWalletIsConnected,
            getAccountBalance,
            currentAddress,
            currentBalance,
            setCurrentAddress,
        }}>
            {children}
        </WalletContext.Provider>
    )
};
