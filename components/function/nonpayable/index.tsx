import Inputs from "components/inputs";
import { AbiDefinedFunction, Address } from "core/types";
import { useArgs } from "hooks";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import Container from "../container";
import Signature from "../signature";

type NonpayableProps = {
  address: Address;
  func: AbiDefinedFunction;
};

const Nonpayable = ({ address, func }: NonpayableProps) => {
  const { args, values, updateValue } = useArgs(func);
  const { config } = usePrepareContractWrite({
    address,
    abi: [func],
    functionName: func.name,
    args,
  });
  const { write, isLoading } = useContractWrite(config);

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
        <button
          type="button"
          disabled={isLoading || !write}
          onClick={() => {
            write?.();
          }}
        >
          write
        </button>
      </Container>
    </li>
  );
};

export default Nonpayable;
