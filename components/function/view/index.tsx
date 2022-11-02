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
  const { args, values, updateValue } = useArgs(func.inputs);
  const { data, isLoading, isError, refetch } = useContractRead({
    address,
    abi: [func],
    functionName: func.name,
    args,
    watch: true,
  });

  return (
    <li key={func.name}>
      <Signature func={func} />
      <Inputs
        name={func.name}
        inputs={func.inputs}
        values={values}
        updateValue={updateValue}
      />
      <Container>
        <Button onClick={() => refetch()}>read</Button>
        <Output data={data} isLoading={isLoading} isError={isError} />
      </Container>
    </li>
  );
};

export default View;
