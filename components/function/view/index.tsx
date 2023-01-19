import { Button } from "components/button";
import { Inputs } from "components/inputs";
import {
  Abi,
  AbiDefinedFunction,
  AbiParameterWithComponents,
  Address,
  Result,
} from "core/types";
import { useArgs, useToggle } from "hooks";
import { useContractRead } from "wagmi";
import { Container } from "../container";
import { Output } from "../output";
import { Signature } from "../signature";

type ViewProps = {
  address: Address;
  func: AbiDefinedFunction;
  initialCollapsed: boolean;
};

export const View = ({ address, func, initialCollapsed }: ViewProps) => {
  const { args, formattedArgs, updateValue, isTouched } = useArgs(
    func.inputs as AbiParameterWithComponents[]
  );
  const { data, isLoading, isError, error, refetch } = useContractRead<
    Abi,
    string,
    Result
  >({
    address,
    abi: [func],
    functionName: func.name,
    args: formattedArgs,
    watch: true,
  });
  const { state: collapsed, toggle: toggleCollapsed } =
    useToggle(initialCollapsed);

  return (
    <li key={func.name} className="flex flex-col gap-2">
      <Signature
        func={func}
        collapsed={collapsed}
        toggleCollapsed={toggleCollapsed}
      />

      {!collapsed && (
        <>
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
        </>
      )}
    </li>
  );
};
