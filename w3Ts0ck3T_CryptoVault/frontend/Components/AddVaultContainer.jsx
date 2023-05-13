import { useState, useContext } from "react";
import { ComponentContext } from "../contexts/ComponentContext";
import { InteractContext } from "../contexts/InteractContext";
import { WalletContext } from "../contexts/WalletContext";

const AddVaultContainer = () => {
  const [w_address, set_w_address] = useState("");
  const [amount, set_amount] = useState("");
  const [timestamp, set_timestamp] = useState("");

  const componentProviderContext = useContext(ComponentContext);
  const { set_add_vault_comp, set_loading_comp } = componentProviderContext;

  const interactContext = useContext(InteractContext);
  const { addVault } = interactContext;

  const walletContext = useContext(WalletContext);
  const { currentAddress } = walletContext;

  const AddVault = async () => {
    set_add_vault_comp(false);
    set_loading_comp(true);
    await addVault(currentAddress, w_address, amount, timestamp);
    set_loading_comp(false);
  };

  return (
    <main className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className="p-6 bg-black border">
        <p className="text-3xl py-2">Add Vault</p>
        <div className="flex flex-col py-2">
          <label>Withdrawer Address</label>
          <input
            className="bg-transparent border p-2 w-96"
            onChange={(e) => set_w_address(e.target.value)}
          ></input>
        </div>
        <div className="flex flex-col py-2">
          <label>Amount (ETH)</label>
          <input
            className="bg-transparent border p-2 w-96"
            onChange={(e) => set_amount(e.target.value)}
          ></input>
        </div>
        <div className="flex flex-col py-2">
          <label>Unlock TimeStamp (Minutes)</label>
          <input
            className="bg-transparent border p-2 w-96"
            onChange={(e) => set_timestamp(e.target.value)}
          ></input>
          <label className=" text-xs">
            Enter number of minutes you want to lock the funds.
          </label>
        </div>
        <button
          className="w-96 bg-white text-black p-2 my-2"
          onClick={() => AddVault()}
        >
          Add Vault
        </button>
        <p
          className="underline cursor-pointer w-min"
          onClick={() => set_add_vault_comp(false)}
        >
          close
        </p>
      </div>
    </main>
  );
};

export default AddVaultContainer;
