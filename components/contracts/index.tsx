import { ContractDetails } from "core/types";
import { useContracts } from "hooks";

export const Contracts = () => {
  const { contracts, isLoading, isError } = useContracts();

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error</div>;
  if (contracts.length === 0) return <div>no contracts</div>;
  return (
    <ul>
      {contracts.map((contract: ContractDetails) => (
        <li key={contract.address}>{contract.name}</li>
      ))}
    </ul>
  );
};
