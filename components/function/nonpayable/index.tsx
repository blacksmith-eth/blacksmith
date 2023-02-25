import { Button } from "components/button";
import { Inputs } from "components/inputs";
import {
  Abi,
  AbiDefinedNonpayableFunction,
  AbiParameterWithComponents,
  Address,
} from "core/types";
import { useArgs, useToggle } from "hooks";
import { useContractWrite } from "wagmi";
import { Container } from "../container";
import { Output } from "../output";
import { Signature } from "../signature";

type NonpayableProps = {
  address: Address;
  func: AbiDefinedNonpayableFunction;
  initialCollapsed: boolean;
};

export const Nonpayable = ({
  address,
  func,
  initialCollapsed,
}: NonpayableProps) => {
  const { args, formattedArgs, updateValue, isTouched } = useArgs(
    func.inputs as AbiParameterWithComponents[]
  );
  const { data, write, isLoading, isError, error } = useContractWrite<
    "recklesslyUnprepared",
    Abi,
    string
  >({
    abi: [func] as const,
    address,
    args: formattedArgs,
    functionName: func.name,
    mode: "recklesslyUnprepared",
  });
  const isDisabled = isLoading || !write;
  const handleClick = () => {
    write?.();
  };
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
            <Button type="button" disabled={isDisabled} onClick={handleClick}>
              write
            </Button>
            <Output
              data={data ? data.hash : undefined}
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
