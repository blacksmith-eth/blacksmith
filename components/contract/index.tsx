import Functions from "components/functions";
import { Abi, AbiDefinedFunction, Address } from "core/types";
import { useContracts } from "hooks";

const filterDefinedFunctions = (abi: Abi): AbiDefinedFunction[] => {
  return abi.filter(({ type }) => type === "function") as AbiDefinedFunction[];
};

const Contract = ({ address }: { address: Address }) => {
  const { contracts, isLoading, isError } = useContracts();

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error</div>;
  if (!contracts || contracts.length === 0) return <div>no contracts</div>;

  const contract = contracts.find((contract) => contract.address === address);
  if (!contract) return <div>selected contract not found</div>;

  return (
    <section>
      <h3 className="font-bold text-2xl">{contract.name}</h3>
      <Functions functions={filterDefinedFunctions(contract.abi)} />
    </section>
  );
};

export default Contract;
