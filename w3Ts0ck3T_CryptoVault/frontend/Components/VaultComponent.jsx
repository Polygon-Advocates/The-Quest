import React, { useContext, useEffect, useState } from "react";
import { FaEthereum } from "react-icons/fa";
import { InteractContext } from "../contexts/InteractContext";
import { ethers } from "ethers";
import { WalletContext } from "../contexts/WalletContext";
import { ComponentContext } from "../contexts/ComponentContext";

const VaultComponent = ({ id }) => {
  const interactContext = useContext(InteractContext);
  const { getVaultInformation, releaseVault } = interactContext;
  const walletContext = useContext(WalletContext);
  const { currentAddress } = walletContext;
  const [vaultInfo, setVaultInfo] = useState([]);
  const componentProviderContext = useContext(ComponentContext);
  const { set_loading_comp } = componentProviderContext;
  const getInfo = async () => {
    set_loading_comp(true);
    const res = await getVaultInformation(id);
    // console.log(res);
    setVaultInfo(res);
    set_loading_comp(false);
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <div className="flex p-4 border gap-4 justify-between items-center">
      <p>{id}</p>
      <p>{vaultInfo.withdrawer}</p>
      {vaultInfo.amount && (
        <p className="flex items-center gap-1">
          {parseInt(vaultInfo.amount.toString()) / 1e18} <FaEthereum />
        </p>
      )}
      {vaultInfo.tokensLoaned && (
        <p>{parseInt(vaultInfo.tokensLoaned.toString()) / 1e18} VLTK</p>
      )}
      {vaultInfo.unlockTimeStamp && (
        <p>{vaultInfo.unlockTimeStamp.toString()} sec</p>
      )}
      {!vaultInfo.withdrawn && (
        <button
          className="border px-4 py-2 hover:bg-white hover:text-black"
          onClick={() => {
            set_loading_comp(true);
            releaseVault(currentAddress, id);
            set_loading_comp(false);
          }}
        >
          Release Vault
        </button>
      )}
      {vaultInfo.withdrawn && <p className="px-4 py-2">Vault Released !!</p>}
    </div>
  );
};

export default VaultComponent;

/*
address withdrawer;
uint256 amount;
uint256 unlockTimeStamp;
bool withdrawn;
bool deposited;
uint256 tokensLoaned;
*/
