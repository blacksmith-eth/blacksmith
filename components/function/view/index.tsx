import Inputs from "components/inputs";
import { AbiDefinedFunction, Address } from "core/types";
import { useContractRead } from "wagmi";
import Container from "../container";
import Output from "../output";
import Signature from "../signature";

type ViewProps = {
  address: Address;
  func: AbiDefinedFunction;
};

const View = ({ address, func }: ViewProps) => {
  const { data, isLoading, isError, refetch } = useContractRead({
    address,
    abi: [func],
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

export default View;
