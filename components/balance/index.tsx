import { Address } from "core/types";
import { useBalance } from "wagmi";

type BalanceProps = {
  address: Address;
};

const Balance = ({ address }: BalanceProps) => {
  const { data, isError, isLoading } = useBalance({
    addressOrName: address,
    watch: true,
  });

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>Error retrieving balance</div>;
  return (
    <div>
      {data?.formatted} {data?.symbol}
    </div>
  );
};

export default Balance;
