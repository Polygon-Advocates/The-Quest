import { useContext, useEffect, useState } from "react";
import { WalletContext } from "../contexts/WalletContext";
import { IoRefreshOutline } from "react-icons/io5";
import { ethers } from "ethers";

const StatusBar = ({ allowance_amount }) => {
  const walletContext = useContext(WalletContext);
  const { currentAddress } = walletContext;
  const [time, setTime] = useState(0);
  const [timeLoading, setTimeLoading] = useState(false);

  const setBlockTimestamp = async () => {
    setTimeLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const latestBlockTimestamp = (await provider.getBlock("latest")).timestamp;
    setTime(latestBlockTimestamp);
    setTimeLoading(false);
  };

  useEffect(() => {
    setBlockTimestamp();
  }, []);

  return (
    <div className="fixed bottom-0 right-0 p-2 flex items-center gap-2 text-sm bg-black">
      <div className="flex gap-2 items-center">
        <p>Wallet Status : </p>
        {currentAddress !== "" ? (
          <div className="h-3 w-3 bg-green-400 rounded-lg"></div>
        ) : (
          <div className="h-3 w-3 bg-red-500 rounded-lg"></div>
        )}
      </div>
      <div>|</div>
      <div className="flex items-center gap-2">
        <p>Current Timestamp : {time}</p>
        <IoRefreshOutline
          className={`${timeLoading ? "animate-spin" : "cursor-pointer"}`}
          onClick={() => setBlockTimestamp()}
        />
      </div>
      <div className="flex items-center gap-2">
        <p>Allowance : {allowance_amount / 1e18}</p>
        {allowance_amount > 0 ? (
          <div className="h-3 w-3 bg-green-400 rounded-lg"></div>
        ) : (
          <div className="h-3 w-3 bg-red-500 rounded-lg"></div>
        )}
      </div>
    </div>
  );
};

export default StatusBar;
