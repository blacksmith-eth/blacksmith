import React from "react";
import Button from "components/button";
import Inputs from "components/inputs";
import {
  AbiDefinedFunction,
  AbiParameterWithComponents,
  Address,
} from "core/types";
import { useArgs } from "hooks";
import { useContractRead } from "wagmi";
import Container from "../container";
import Output from "../output";
import Signature from "../signature";

type PureProps = {
  address: Address;
  func: AbiDefinedFunction;
};

const Pure = ({ address, func }: PureProps) => {
  const { args, formattedArgs, updateValue, isTouched } = useArgs(
    func.inputs as AbiParameterWithComponents[]
  );
  const { data, isLoading, isError, error, refetch } = useContractRead({
    address,
    abi: [func],
    functionName: func.name,
    args: formattedArgs,
    watch: true,
  });
  const [collapsed, setCollapsed] = React.useState(true)

  return (
    <li key={func.name} className="flex flex-col gap-2">
      <Signature func={func} collapsed={collapsed} setCollapsed={setCollapsed} />

      { !collapsed && (<>
        <Inputs name={func.name} args={args} updateValue={updateValue} />
        <Container>
          <Button onClick={() => refetch()}>read</Button>
          <Output
            data={data}
            isTouched={isTouched}
            isLoading={isLoading}
            isError={isError}
            error={error}
          />
        </Container>
      </>)}
    </li>
  );
};

export default Pure;
