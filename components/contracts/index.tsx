import { Address, ContractDetails } from "core/types";
import { useContracts } from "hooks";

type ContractsProps = {
  activeContract: Address;
  setActiveContract(address: Address): void;
};

export const Contracts = ({
  activeContract,
  setActiveContract,
}: ContractsProps) => {
  const { contracts, isLoading, isError } = useContracts();

  if (isLoading) return <div className="flex-grow">loading...</div>;
  if (isError) return <div className="flex-grow">error</div>;
  if (!contracts || contracts.length === 0)
    return <div className="flex-grow">No contracts</div>;
  return (
    <ul className="flex-grow">
      {contracts.map((contract: ContractDetails) => (
        <li key={contract.address}>
          <button
            onClick={() => setActiveContract(contract.address)}
            className={`focus:underline focus:outline-none hover:bg-slate-200 focus:bg-slate-200 dark:hover:bg-white dark:hover:text-black dark:focus:bg-white dark:focus:text-black ${
              contract.address === activeContract ? "font-semibold" : ""
            }`}
          >
            {contract.name}
          </button>
        </li>
      ))}
    </ul>
  );
};
