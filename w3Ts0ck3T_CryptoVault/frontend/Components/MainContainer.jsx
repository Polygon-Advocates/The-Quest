import { useContext, useEffect, useState } from "react";
import AddVaultContainer from "./AddVaultContainer";
import SectionHeader from "./SectionHeader";
import VaultComponent from "./VaultComponent";
import { ComponentContext } from "../contexts/ComponentContext";
import LoadingComponent from "./LoadingComponent";
import StatusBar from "./StatusBar";
import { InteractContext } from "../contexts/InteractContext";
import { WalletContext } from "../contexts/WalletContext";

const MainContainer = () => {
  const [allowance, setAllowance] = useState(0);

  const componentProviderContext = useContext(ComponentContext);
  const { add_vault_comp, set_add_vault_comp, loading_comp, set_loading_comp } =
    componentProviderContext;

  const interactContext = useContext(InteractContext);
  const {
    getVaultsByAddr,
    vaultIDs,
    checkAllowance,
    approveTokenTransfer,
    loading_compTXN,
  } = interactContext;

  const walletContext = useContext(WalletContext);
  const { currentAddress } = walletContext;

  const checkAllowanceFunction = async () => {
    const allowance_amount = await checkAllowance(currentAddress);
    setAllowance(parseInt(allowance_amount).toString());
  };

  useEffect(() => {
    set_loading_comp(true);
    getVaultsByAddr(currentAddress);
    checkAllowanceFunction();
    set_loading_comp(false);
  }, [currentAddress]);

  return (
    <main className="p-6">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl">Your Vaults</h1>
          {allowance >= 100 ? (
            <button
              className="border px-4 py-2 hover:bg-white hover:text-black"
              onClick={() => set_add_vault_comp(true)}
            >
              Add Vault
            </button>
          ) : (
            <button
              className="border px-4 py-2 cursor-not-allowed"
              onClick={() => alert("Please approve the token transfer !!!")}
            >
              Add Vault
            </button>
          )}
        </div>
        <div className="h-5"></div>
        <SectionHeader />
        <div className="py-2"></div>
        {vaultIDs.length === 0 ? (
          <p>No vaults present. Please create one.</p>
        ) : (
          <p></p>
        )}
        {vaultIDs.map((vault, index) => {
          return (
            <VaultComponent id={vault.toString()} key={index}></VaultComponent>
          );
        })}
        {add_vault_comp && <AddVaultContainer />}
        {(loading_comp || loading_compTXN) && <LoadingComponent />}
        {allowance <= 10 && (
          <button
            className="border px-4 py-2 hover:bg-white hover:text-black my-3"
            onClick={() => approveTokenTransfer(currentAddress)}
          >
            Approve Token Transfer
          </button>
        )}
        <StatusBar allowance_amount={allowance} />
      </div>
    </main>
  );
};

export default MainContainer;
