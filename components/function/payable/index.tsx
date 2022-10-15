import Inputs from "components/inputs";
import { AbiDefinedFunction, Address } from "core/types";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import Container from "../container";
import Signature from "../signature";

type PayableProps = {
  address: Address;
  func: AbiDefinedFunction;
};

const Payable = ({ address, func }: PayableProps) => {
  const { config } = usePrepareContractWrite({
    address,
    abi: [func],
    functionName: func.name,
  });
  const { write, isLoading } = useContractWrite(config);

  return (
    <li key={func.name}>
      <Signature func={func} />
      <Inputs name={func.name} inputs={func.inputs} />
      <Container>
        <button
          type="button"
          disabled={isLoading || !write}
          onClick={() => {
            write?.();
          }}
        >
          send
        </button>
      </Container>
    </li>
  );
};

export default Payable;
