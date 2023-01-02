import { Button } from "components/button";
import { Inputs } from "components/inputs";
import {
  Abi,
  AbiDefinedFunction,
  AbiParameterWithComponents,
  Address,
} from "core/types";
import { useArgs } from "hooks";
import { useContractWrite } from "wagmi";
import { Container } from "../container";
import { Output } from "../output";
import { Signature } from "../signature";

type NonpayableProps = {
  address: Address;
  func: AbiDefinedFunction;
};

export const Nonpayable = ({ address, func }: NonpayableProps) => {
  const { args, formattedArgs, updateValue, isTouched } = useArgs(
    func.inputs as AbiParameterWithComponents[]
  );
  const { data, write, isLoading, isError, error } = useContractWrite<
    "recklesslyUnprepared",
    Abi,
    string
  >({
    mode: "recklesslyUnprepared",
    address,
    abi: [func] as const,
    functionName: func.name,
    args: formattedArgs,
  });
  const isDisabled = isLoading || !write;
  const handleClick = () => {
    write?.();
  };

  return (
    <li key={func.name} className="flex flex-col gap-2">
      <Signature func={func} />
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
    </li>
  );
};
