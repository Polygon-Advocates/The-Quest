import { CRYPTO_VAULT_ABI, CRYPTO_VAULT_ADDRESS, VAULT_TOKEN_ABI, VAULT_TOKEN_ADDRESS } from '../utils/constants';
import React, { createContext, useContext, useState } from 'react';
import { ethers } from 'ethers';

let Eth;

if (typeof window !== 'undefined') {
    Eth = window.ethereum;
} else {
    console.log("window.ethereum is not found");
}

export const useContract = (address, abi) => {
    try {
        const provider = new ethers.providers.Web3Provider(Eth);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(address, abi, signer);
        return contract;
    } catch (e) {
        console.log(e);
        return false;
    }
};

export const InteractContext = createContext();

export const InteractContextProvider = ({ children }) => {
    const [vltkBalance, setVltkBalance] = useState(0.0);
    const [vaultIDs, setVaultIDs] = useState([]);
    const [loading_compTXN, set_loading_compTXN] = useState(false);

    // ABI & ADDRESSES
    const cryptoVaultABI = CRYPTO_VAULT_ABI;
    const vaultTokenABI = VAULT_TOKEN_ABI;
    const cryptoVaultAddress = CRYPTO_VAULT_ADDRESS;
    const vaultTokenAddress = VAULT_TOKEN_ADDRESS;

    // (Eth) && Eth.on('accountsChanged', async (accounts) => {
    //     try {
    //         console.log("Account changed", accounts);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // })

    const getVLTKBalance = async (address) => {
        if (address === '' || address === undefined) {
            return {
                status: "Please check your wallet connection"
            }
        }

        const provider = new ethers.providers.Web3Provider(Eth);
        const signer = provider.getSigner();
        const VaultTokenContract = new ethers.Contract(
            vaultTokenAddress,
            vaultTokenABI,
            signer
        );

        try {
            const balance = await VaultTokenContract.balanceOf(address);
            setVltkBalance(parseInt(balance) / 1e18);
        } catch (error) {
            console.log(error);
        }
    }

    const getVaultsByAddr = async (address) => {
        const cryptoVault = useContract(cryptoVaultAddress, cryptoVaultABI);
        if (!Eth || address === '' || address === undefined) {
            return {
                status: "Please check your wallet connection"
            }
        }
        try {
            set_loading_compTXN(true);
            const vaults = await cryptoVault.getVaultsByWithdrawer(address);
            setVaultIDs(vaults);
            set_loading_compTXN(false);

        } catch (error) {
            console.log(error);
        }
    }

    const getVaultInformation = async (id) => {
        const cryptoVault = useContract(cryptoVaultAddress, cryptoVaultABI);
        if (!Eth || id === '' || id === undefined) {
            return {
                status: "Please check your wallet connection"
            }
        }
        try {
            set_loading_compTXN(true);
            const vault = await cryptoVault.getVaultById(id);
            set_loading_compTXN(false);
            return vault;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    const addVault = async (address, withdrawer_address, amount, time) => {
        if (!Eth) {
            return {
                status: "Please check your wallet connection"
            };
        }

        if (withdrawer_address.trim() === "" || amount.trim() === "" || time.trim() === "" || address.trim() === "") {
            return {
                status: "Your fields cannot be empty.",
            };
        }

        const cryptoVault = useContract(cryptoVaultAddress, cryptoVaultABI);


        const provider = new ethers.providers.Web3Provider(Eth);
        const latestBlockTimestamp = (await provider.getBlock("latest")).timestamp;
        const timestampObj = new Date(latestBlockTimestamp * 1000);
        const unlockTime = timestampObj.setMinutes(timestampObj.getMinutes() + parseInt(time)) / 1000;

        const parsed_amount = ethers.utils.hexlify(ethers.utils.parseUnits(amount, "ether"));

        // console.log(parsed_amount.toString())
        const wei_amount = ethers.utils.parseEther(amount).toString();
        const txnData = cryptoVault.interface.encodeFunctionData('lockTokens', [address, wei_amount, unlockTime]);

        console.log(txnData);

        const txnParams = {
            to: cryptoVaultAddress,
            from: address,
            data: txnData,
            value: parsed_amount,
            gas: '0x7EF40'
        };

        try {
            set_loading_compTXN(true);

            const transactionHash = await Eth.request({
                method: "eth_sendTransaction",
                params: [txnParams],
            });

            const receipt = await transactionHash.wait();

            console.log(receipt);
            getVaultsByAddr(address);
            set_loading_compTXN(false);
            return receipt;
        } catch (error) {
            return error;
        }
    }

    const releaseVault = async (address, id) => {
        if (!Eth) {
            return {
                status: "Please check your wallet connection"
            };
        }

        if (address.trim() === "" || id.trim() === "") {
            return {
                status: "Your fields cannot be empty.",
            };
        }

        const cryptoVault = useContract(cryptoVaultAddress, cryptoVaultABI);


        const txnData = cryptoVault.interface.encodeFunctionData('withdrawTokens', [id]);

        const txnParams = {
            to: cryptoVaultAddress,
            from: address,
            data: txnData,
            gas: '0x7EF40'
        };

        try {
            set_loading_compTXN(true);

            const transactionHash = await Eth.request({
                method: "eth_sendTransaction",
                params: [txnParams],
            });

            await transactionHash.wait();

            console.log(transactionHash);
            set_loading_compTXN(false);

            return transactionHash;
        } catch (error) {
            return error;
        }
    }

    const approveTokenTransfer = async (address) => {
        if (!Eth) {
            return {
                status: "Please check your wallet connection"
            };
        }
        if (address.trim() === "") {
            return {
                status: "Your fields cannot be empty.",
            };
        }
        const vaultToken = useContract(vaultTokenAddress, vaultTokenABI);
        const wei_amount = ethers.utils.parseEther("1000000000").toString();
        const txnData = vaultToken.interface.encodeFunctionData('approve', [vaultTokenAddress, wei_amount]);

        const txnParams = {
            to: vaultTokenAddress,
            from: address,
            data: txnData,
            gas: '0x7EF40'
        };

        try {
            const transactionHash = await Eth.request({
                method: "eth_sendTransaction",
                params: [txnParams],
            });

            await transactionHash.wait();

            console.log(transactionHash);
            return transactionHash;
        } catch (error) {
            return error;
        }

    }

    const checkAllowance = async (address) => {
        if (!Eth) {
            return {
                status: "Please check your wallet connection"
            };
        }
        if (address.trim() === "") {
            return {
                status: "Your fields cannot be empty.",
            };
        }

        const vaultToken = useContract(vaultTokenAddress, vaultTokenABI);

        try {
            const allowance_amount = await vaultToken.allowance(address, vaultTokenAddress);
            console.log(allowance_amount);
            return allowance_amount;
        } catch (error) {
            console.log(error);
        }
    }

    return <InteractContext.Provider value={{
        getVLTKBalance,
        vltkBalance,
        setVltkBalance,
        getVaultsByAddr,
        getVaultInformation,
        vaultIDs,
        setVaultIDs,
        addVault,
        releaseVault,
        approveTokenTransfer,
        checkAllowance,
        loading_compTXN
    }}>
        {children}
    </InteractContext.Provider>
}
