import { Button } from "components/button";
import { Inputs } from "components/inputs";
import {
  Abi,
  AbiDefinedViewFunction,
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
  func: AbiDefinedViewFunction;
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
    abi: [func],
    address,
    args: formattedArgs,
    functionName: func.name,
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
