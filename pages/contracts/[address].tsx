import { Contract } from "components/contract";
import { Address } from "core/types";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const ContractPage: NextPage = () => {
  const router = useRouter();
  const { address } = router.query;

  return (
    <>
      <h2 className="font-bold">Contract</h2>
      <Contract address={address as Address} />
    </>
  );
};

export default ContractPage;
