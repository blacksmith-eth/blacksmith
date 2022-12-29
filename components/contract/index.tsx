import { Square2StackIcon } from "@heroicons/react/24/outline";
import { Balance } from "components/balance";
import { Functions } from "components/functions";
import { AddressZero } from "core/constants";
import { Abi, AbiDefinedFunction, Address } from "core/types";
import { useContracts } from "hooks";
import { Manager } from "./manager";
import { Setup } from "./setup";

const filterDefinedFunctions = (abi: Abi): AbiDefinedFunction[] => {
  return abi.filter(({ type }) => type === "function") as AbiDefinedFunction[];
};

const Introduction = () => (
  <div className="flex flex-col gap-4">
    <Setup />
    <Manager />
  </div>
);

type ContractProps = { address: Address };

export const Contract = ({ address }: ContractProps) => {
  const { contracts, isLoading, isError } = useContracts();

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error</div>;
  if (!contracts || contracts.length === 0 || address === AddressZero)
    return <Introduction />;

  const contract = contracts.find((contract) => contract.address === address);
  if (!contract)
    return (
      <>
        <div>
          Selected contract{" "}
          <span className="font-mono bg-slate-100 dark:bg-black px-1 rounded">
            {address}
          </span>{" "}
          not found.
        </div>
        <Introduction />
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
        className="inline p-0.5 mx-0.5 rounded-sm text-black dark:text-white focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black focus:outline-none"
        onClick={handleCopyAddress}
      >
        <span className="sr-only">Copy Address</span>
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
