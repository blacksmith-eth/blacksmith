import Button from "components/button";
import Inputs from "components/inputs";
import { AbiDefinedFunction, Address } from "core/types";
import { useArgs, useEther } from "hooks";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import Container from "../container";
import Signature from "../signature";

type PayableProps = {
  address: Address;
  func: AbiDefinedFunction;
};

const Payable = ({ address, func }: PayableProps) => {
  const { args, values, updateValue } = useArgs(func);
  const { value, formattedValue, handleValueChange } = useEther();
  const { config } = usePrepareContractWrite({
    address,
    abi: [func],
    functionName: func.name,
    args,
    overrides: {
      value: formattedValue,
    },
  });
  const { write, isLoading } = useContractWrite(config);

  return (
    <li key={func.name}>
      <Signature func={func} />
      <section className="flex flex-col">
        <label htmlFor={`${func.name}-value`}>value :: uint256</label>
        <input
          id={`${func.name}-value`}
          value={value}
          onChange={handleValueChange}
          type="text"
          className="border"
        />
      </section>
      <Inputs
        name={func.name}
        inputs={func.inputs}
        values={values}
        updateValue={updateValue}
      />
      <Container>
        <Button
          type="button"
          disabled={isLoading || !write}
          onClick={() => {
            write?.();
          }}
        >
          send
        </Button>
      </Container>
    </li>
  );
};

export default Payable;
