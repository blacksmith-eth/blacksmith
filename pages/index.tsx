import { WalletIcon } from "@heroicons/react/24/outline";
import Connect from "components/connect";
import Contract from "components/contract";
import { Contracts } from "components/contracts";
import { Address } from "core/types";
import { ethers } from "ethers";
import { useToggle } from "hooks";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

const Wallet = ({ open }: { open: boolean }) => {
  if (!open) return <></>;
  return (
    <aside className="bg-white border-l p-2 fixed right-0 h-full w-full lg:w-96 overflow-y-auto overscroll-none">
      <h2>wallet</h2>
    </aside>
  );
};

const Drawer = ({ open }: { open: boolean }) => {
  if (!open) return <></>;
  return (
    <section className="h-52 overflow-y-auto overscroll-none">
      <h2>drawer</h2>
    </section>
  );
};

const Home: NextPage = () => {
  const [activeContract, setActiveContract] = useState<Address>(
    ethers.constants.AddressZero
  );
  const { state: isWalletOpen, toggle: toggleWallet } = useToggle(false);
  const { state: isDrawerOpen, toggle: toggleDrawer } = useToggle(false);

  const walletButtonText = isWalletOpen ? "close wallet" : "open wallet";
  const drawerButtonText = isDrawerOpen ? "close drawer" : "open drawer";

  return (
    <section className="min-h-screen max-h-screen flex flex-col overflow-hidden">
      <Head>
        <title>Blacksmith</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-white border-b sticky top-0 p-2 flex justify-between">
        <h1 className="font-bold">Blacksmith</h1>
        <section className="flex gap-1">
          <Connect />
          <button onClick={toggleWallet}>
            <WalletIcon className="w-6 h-6" />
            <span className="sr-only">{walletButtonText}</span>
          </button>
        </section>
      </header>
      <main className="bg-white flex flex-col md:flex-row flex-grow overflow-y-auto overscroll-none">
        <aside className="bg-white border-b md:border-r p-2 w-full md:static md:basis-1/5 md:overflow-y-auto md:overscroll-none">
          <h2 className="font-bold">Contracts</h2>
          <Contracts
            activeContract={activeContract}
            setActiveContract={setActiveContract}
          />
        </aside>
        <section className="flex flex-col flex-grow">
          <section className="bg-white p-2 flex-grow overflow-y-auto overscroll-none">
            <h2 className="font-bold">Contract</h2>
            <Contract address={activeContract} />
          </section>
          <section className="bg-white border-t sticky bottom-0 p-2">
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
