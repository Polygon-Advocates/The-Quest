import { BsSafe2Fill } from "react-icons/bs";
import { FaEthereum } from "react-icons/fa";
import { useContext, useEffect } from "react";
import { WalletContext } from "../contexts/WalletContext";
import { InteractContext } from "../contexts/InteractContext";
import { ComponentContext } from "../contexts/ComponentContext";

const Navbar = () => {
  const walletContext = useContext(WalletContext);
  const {
    currentAddress,
    checkIfWalletIsConnected,
    connectWallet,
    getAccountBalance,
    currentBalance,
  } = walletContext;

  const interactContext = useContext(InteractContext);
  const { getVLTKBalance, vltkBalance } = interactContext;

  const componentContext = useContext(ComponentContext);
  const { set_loading_comp } = componentContext;

  useEffect(() => {
    set_loading_comp(true);
    checkIfWalletIsConnected();
    getAccountBalance();
    getVLTKBalance(currentAddress);
    set_loading_comp(false);
  }, []);

  useEffect(() => {
    set_loading_comp(true);
    getAccountBalance();
    getVLTKBalance(currentAddress);
    set_loading_comp(false);
  }, [currentAddress]);

  return (
    <div className="flex p-6 items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-xl">HyperVault</h1>
        <BsSafe2Fill />
      </div>
      <div className="flex items-center gap-5">
        <div>
          ETH :
          {currentAddress === "" || currentAddress === undefined
            ? `--`
            : ` ${currentBalance}`}
        </div>
        <div>VLTK : {vltkBalance}</div>
        <button
          className="flex items-center border gap-3 px-4 py-2"
          onClick={() => connectWallet()}
        >
          {currentAddress === "" || currentAddress === undefined ? (
            <p className="flex items-center">
              Connect Wallet <FaEthereum />
            </p>
          ) : (
            `${currentAddress.slice(0, 6)}...${currentAddress.slice(-4)}`
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
