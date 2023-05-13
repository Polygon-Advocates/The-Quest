// import Image from "next/image";
import Navbar from "../Components/Navbar";
import MainContainer from "../Components/MainContainer";
import { WalletProvider } from "../contexts/WalletContext";
import { ComponentContextProvider } from "../contexts/ComponentContext";
import { InteractContextProvider } from "../contexts/InteractContext";
import Head from "next/head";

export default function Home() {
    return (
        <ComponentContextProvider>
            <InteractContextProvider>
                <WalletProvider>
                    <main className="flex flex-col">
                        <Head>
                            <title>Hyper | Vault</title>
                        </Head>
                        <Navbar />
                        <MainContainer />
                    </main>
                </WalletProvider>
            </InteractContextProvider>
        </ComponentContextProvider>
    );
}
