import Inputs from "components/inputs";
import { AbiDefinedFunction } from "core/types";
import Signature from "../signature";

type ViewProps = {
  func: AbiDefinedFunction;
};

const View = ({ func }: ViewProps) => {
  return (
    <li key={func.name}>
      <Signature func={func} />
      <Inputs name={func.name} inputs={func.inputs} />
    </li>
  );
};

export default View;
