import { WalletIcon } from "@heroicons/react/24/outline";
import Anchor from "components/anchor";
import Connect from "components/connect";
import Contract from "components/contract";
import Contracts from "components/contracts";
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
  const walletButtonText = isWalletOpen ? "close wallet" : "open wallet";

  const resetActiveContract = () =>
    setActiveContract(ethers.constants.AddressZero);

  return (
    <section className="text-black dark:text-white dark:bg-black min-h-screen max-h-screen flex flex-col overflow-hidden selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Head>
        <title>Blacksmith</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-white dark:bg-black border-b border-black dark:border-white sticky top-0 p-2 flex items-center justify-between">
        <h1 className="font-bold">
          <button
            onClick={resetActiveContract}
            className="focus:underline focus:outline-none"
          >
            Blacksmith
          </button>
        </h1>
        <section className="flex items-center gap-1">
          <Connect />
          <button onClick={toggleWallet} className="text-black dark:text-white">
            <WalletIcon className="w-6 h-6" />
            <span className="sr-only">{walletButtonText}</span>
          </button>
        </section>
      </header>
      <main className="bg-white dark:bg-black flex flex-col md:flex-row flex-grow overflow-y-auto overscroll-none">
        <aside className="flex flex-col bg-white dark:bg-black border-b border-black dark:border-white md:border-b-0 md:border-r p-2 w-full md:static md:basis-1/5 md:overflow-y-auto md:overscroll-none min-w-fit">
          <h2 className="font-bold">Contracts</h2>
          <Contracts
            activeContract={activeContract}
            setActiveContract={setActiveContract}
          />
          <section className="text-sm">
            <span>
              Created by{" "}
              <Anchor href="https://twitter.com/0xholypanda">
                0xholypanda
              </Anchor>
            </span>
            <span> | </span>
            <Anchor href="https://github.com/blacksmith-eth/blacksmith">
              star on github
            </Anchor>
            <span> | </span>
            <Anchor href="https://github.com/blacksmith-eth/blacksmith/issues/new">
              report an issue
            </Anchor>
          </section>
        </aside>
        <section className="flex flex-col flex-grow">
          <section className="bg-white dark:bg-black p-2 flex-grow overflow-y-auto md:overscroll-none">
            <h2 className="font-bold">Contract</h2>
            <Contract address={activeContract} />
          </section>
        </section>
        <Wallet open={isWalletOpen} />
      </main>
    </section>
  );
};

export default Home;
