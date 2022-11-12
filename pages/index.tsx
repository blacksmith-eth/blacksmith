import { WalletIcon } from "@heroicons/react/24/outline";
import Connect from "components/connect";
import Contract from "components/contract";
import Contracts from "components/contracts";
import Drawer from "components/drawer";
import Wallet from "components/wallet";
import { Address } from "core/types";
import { ethers } from "ethers";
import { useToggle } from "hooks";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

const Home: NextPage = () => {
  const [activeContract, setActiveContract] = useState<Address>(
    ethers.constants.AddressZero
  );
  const { state: isWalletOpen, toggle: toggleWallet } = useToggle(false);
  const { state: isDrawerOpen, toggle: toggleDrawer } = useToggle(false);

  const walletButtonText = isWalletOpen ? "close wallet" : "open wallet";
  const drawerButtonText = isDrawerOpen ? "close drawer" : "open drawer";

  const resetActiveContract = () =>
    setActiveContract(ethers.constants.AddressZero);

  return (
    <section className="text-black min-h-screen max-h-screen flex flex-col overflow-hidden">
      <Head>
        <title>Blacksmith</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-white border-b border-black sticky top-0 p-2 flex items-center justify-between">
        <h1 className="font-bold">
          <button onClick={resetActiveContract}>Blacksmith</button>
        </h1>
        <section className="flex items-center gap-1">
          <Connect />
          <button onClick={toggleWallet} className="text-black">
            <WalletIcon className="w-6 h-6" />
            <span className="sr-only">{walletButtonText}</span>
          </button>
        </section>
      </header>
      <main className="bg-white flex flex-col md:flex-row flex-grow overflow-y-auto overscroll-none">
        <aside className="bg-white border-b border-black md:border-b-0 md:border-r p-2 w-full md:static md:basis-1/5 md:overflow-y-auto md:overscroll-none">
          <h2 className="font-bold">Contracts</h2>
          <Contracts
            activeContract={activeContract}
            setActiveContract={setActiveContract}
          />
        </aside>
        <section className="flex flex-col flex-grow">
          <section className="bg-white p-2 flex-grow overflow-y-auto md:overscroll-none">
            <h2 className="font-bold">Contract</h2>
            <Contract address={activeContract} />
          </section>
          <section className="z-20 bg-white border-t border-black sticky bottom-0 p-2">
            <button onClick={toggleDrawer}>{drawerButtonText}</button>
            <Drawer open={isDrawerOpen} />
          </section>
        </section>
        <Wallet open={isWalletOpen} />
      </main>
    </section>
  );
};

export default Home;
