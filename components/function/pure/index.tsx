import Inputs from "components/inputs";
import { AbiDefinedFunction, Address } from "core/types";
import { useContractRead } from "wagmi";
import Container from "../container";
import Output from "../output";
import Signature from "../signature";

type PureProps = {
  address: Address;
  func: AbiDefinedFunction;
};

const Pure = ({ address, func }: PureProps) => {
  const { data, isLoading, isError, refetch } = useContractRead({
    addressOrName: address,
    contractInterface: [func],
    functionName: func.name,
    watch: true,
  });

  return (
    <li key={func.name}>
      <Signature func={func} />
      <Inputs name={func.name} inputs={func.inputs} />
      <Container>
        <button onClick={() => refetch()}>read</button>
        <Output data={data} isLoading={isLoading} isError={isError} />
      </Container>
    </li>
  );
};

export default Pure;
