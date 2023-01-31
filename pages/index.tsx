import { Introduction } from "components/introduction";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <h2 className="font-bold">Contract</h2>
      <Introduction />
    </>
  );
};

export default Home;
