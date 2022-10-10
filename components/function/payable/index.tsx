import Inputs from "components/inputs";
import { AbiDefinedFunction } from "core/types";
import Signature from "../signature";

type PayableProps = {
  func: AbiDefinedFunction;
};

const Payable = ({ func }: PayableProps) => {
  return (
    <li key={func.name}>
      <Signature func={func} />
      <Inputs name={func.name} inputs={func.inputs} />
    </li>
  );
};

export default Payable;
