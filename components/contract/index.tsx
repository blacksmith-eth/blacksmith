import { Address } from "core/types";
import { useContracts } from "hooks";

const Contract = ({ address }: { address: Address }) => {
  const { contracts, isLoading, isError } = useContracts();

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error</div>;
  if (!contracts || contracts.length === 0) return <div>no contracts</div>;

  const contract = contracts.find((contract) => contract.address === address);
  if (!contract) return <div>selected contract not found</div>;

  return (
    <section>
      <h3>{contract.name}</h3>
    </section>
  );
};

export default Contract;
