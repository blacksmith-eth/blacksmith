import Button from "components/button";
import Inputs from "components/inputs";
import { AbiDefinedFunction, Address } from "core/types";
import { useArgs } from "hooks";
import { useContractRead } from "wagmi";
import Container from "../container";
import Output from "../output";
import Signature from "../signature";

type ViewProps = {
  address: Address;
  func: AbiDefinedFunction;
};

const View = ({ address, func }: ViewProps) => {
  const { args, formattedArgs, updateValue } = useArgs(func.inputs);
  const { data, isLoading, isError, refetch } = useContractRead({
    address,
    abi: [func],
    functionName: func.name,
    args: formattedArgs,
    watch: true,
  });

  return (
    <li key={func.name}>
      <Signature func={func} />
      <Inputs name={func.name} args={args} updateValue={updateValue} />
      <Container>
        <Button onClick={() => refetch()}>read</Button>
        <Output data={data} isLoading={isLoading} isError={isError} />
      </Container>
    </li>
  );
};

export default View;
