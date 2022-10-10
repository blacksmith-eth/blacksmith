import Inputs from "components/inputs";
import { AbiDefinedFunction } from "core/types";
import Signature from "../signature";

type NonpayableProps = {
  func: AbiDefinedFunction;
};

const Nonpayable = ({ func }: NonpayableProps) => {
  return (
    <li key={func.name}>
      <Signature func={func} />
      <Inputs name={func.name} inputs={func.inputs} />
    </li>
  );
};

export default Nonpayable;
