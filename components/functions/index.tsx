import { AbiDefinedFunction } from "core/types";
import Function from "components/function";

type FunctionsProps = {
  functions: AbiDefinedFunction[];
};

const Functions = ({ functions }: FunctionsProps) => {
  if (functions.length === 0) return <div>no functions</div>;
  return (
    <ul className="flex flex-col gap-2">
      {functions.map((func) => (
        <Function key={func.name} func={func} />
      ))}
    </ul>
  );
};

export default Functions;
