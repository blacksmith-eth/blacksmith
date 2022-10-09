import { Address, ContractDetails } from "core/types";
import { useContracts } from "hooks";

type ContractsProps = {
  setActiveContract(address: Address): void;
};

export const Contracts = ({ setActiveContract }: ContractsProps) => {
  const { contracts, isLoading, isError } = useContracts();

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error</div>;
  if (!contracts || contracts.length === 0) return <div>no contracts</div>;
  return (
    <ul>
      {contracts.map((contract: ContractDetails) => (
        <li key={contract.address}>
          <button onClick={() => setActiveContract(contract.address)}>
            {contract.name}
          </button>
        </li>
      ))}
    </ul>
  );
};
