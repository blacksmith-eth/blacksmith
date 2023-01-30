import { Contract } from "components/contract";
import { Contracts } from "components/contracts";
import { Footer } from "components/footer";
import { Header } from "components/header";
import { Wallet } from "components/wallet";
import { Address } from "core/types";
import { useToggle } from "hooks";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const ContractPage: NextPage = () => {
  const router = useRouter();
  const { address } = router.query;
  const { state: isWalletOpen, toggle: toggleWallet } = useToggle(false);
  const walletButtonText = isWalletOpen ? "close wallet" : "open wallet";

  return (
    <section className="text-black dark:text-white dark:bg-black min-h-screen max-h-screen flex flex-col overflow-hidden selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Head>
        <title>Blacksmith</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Blacksmith is an adaptive user interface for smart contract interaction."
        />
      </Head>
      <Header toggleWallet={toggleWallet} walletButtonText={walletButtonText} />
      <main className="bg-white dark:bg-black flex flex-col md:flex-row flex-grow overflow-y-auto overscroll-none">
        <aside className="flex flex-col bg-white dark:bg-black border-b border-black dark:border-white md:border-b-0 md:border-r p-2 w-full md:static md:basis-1/5 md:overflow-y-auto md:overscroll-none min-w-fit">
          <h2 className="font-bold">Contracts</h2>
          <Contracts />
          <Footer />
        </aside>
        <section className="flex flex-col flex-grow bg-white dark:bg-black p-2 overflow-y-auto md:overscroll-none">
          <h2 className="font-bold">Contract</h2>
          <Contract address={address as Address} />
        </section>
        <Wallet open={isWalletOpen} />
      </main>
    </section>
  );
};

export default ContractPage;
