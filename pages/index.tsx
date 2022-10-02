import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <section className="min-h-screen grid grid-cols-12 gap-1 grid-rows-[auto_auto_1fr] md:grid-rows-[auto_1fr]">
      <Head>
        <title>Blacksmith</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="col-span-full"></header>
      <aside className="col-span-full md:col-span-2"></aside>
      <main className="col-span-full md:col-span-10"></main>
      <footer className="col-span-full"></footer>
    </section>
  );
};

export default Home;
