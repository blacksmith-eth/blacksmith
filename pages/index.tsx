import { useToggle } from "hooks";
import type { NextPage } from "next";
import Head from "next/head";

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
        <h1>blacksmith</h1>
        <button onClick={toggleWallet}>{walletButtonText}</button>
      </header>
      <main className="bg-white flex flex-col md:flex-row flex-grow overflow-y-auto overscroll-none">
        <aside className="bg-white border-r p-2 w-full md:static md:basis-1/5 md:overflow-y-auto md:overscroll-none">
          <h2>contracts</h2>
        </aside>
        <section className="flex flex-col flex-grow">
          <section className="bg-white p-2 flex-grow overflow-y-auto overscroll-none">
            <h2>contract</h2>
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
