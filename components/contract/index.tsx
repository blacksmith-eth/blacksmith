import { Square2StackIcon } from "@heroicons/react/24/outline";
import Balance from "components/balance";
import Functions from "components/functions";
import { Abi, AbiDefinedFunction, Address } from "core/types";
import { ethers } from "ethers";
import { useContracts } from "hooks";
import Manager from "./manager";
import Setup from "./setup";

const filterDefinedFunctions = (abi: Abi): AbiDefinedFunction[] => {
  return abi.filter(({ type }) => type === "function") as AbiDefinedFunction[];
};

const Contract = ({ address }: { address: Address }) => {
  const { contracts, isLoading, isError } = useContracts();

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error</div>;
  if (!contracts || contracts.length === 0)
    return (
      <>
        <div>No contracts</div>
        <Setup />
        <Manager />
      </>
    );

  if (address === ethers.constants.AddressZero)
    return (
      <>
        <Setup />
        <Manager />
      </>
    );

  const contract = contracts.find((contract) => contract.address === address);
  if (!contract)
    return (
      <>
        <div>
          Selected contract{" "}
          <span className="font-mono bg-slate-100 px-1 rounded">{address}</span>{" "}
          not found.
        </div>
        <Setup />
        <Manager />
      </>
    );

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(contract.address);
  };

  return (
    <section>
      <h3 className="font-bold text-2xl">{contract.name}</h3>
      <h4 className="inline">{contract.address}</h4>
      <button
        className="inline mx-1 text-slate-600 focus:outline-none hover:text-slate-800 focus:text-slate-800 active:text-slate-900"
        onClick={handleCopyAddress}
      >
        <Square2StackIcon className="h-4 w-4" />
      </button>
      <Balance address={contract.address} />
      <Functions
        address={contract.address}
        functions={filterDefinedFunctions(contract.abi)}
      />
    </section>
  );
};

export default Contract;
