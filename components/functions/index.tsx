import { AbiDefinedFunction, Address } from "core/types";
import Function from "components/function";

type FunctionsProps = {
  address: Address;
  functions: AbiDefinedFunction[];
};

const Functions = ({ address, functions }: FunctionsProps) => {
  if (functions.length === 0) return <div>no functions</div>;
  return (
    <ul className="flex flex-col gap-2">
      {functions.map((func) => (
        <Function key={func.name} address={address} func={func} />
      ))}
    </ul>
  );
};

export default Functions;
