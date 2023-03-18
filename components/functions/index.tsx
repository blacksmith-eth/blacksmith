import { AbiDefinedStateFunction, Address } from "core/types";
import { Func } from "components/function";

type FunctionsProps = {
  address: Address;
  functions: AbiDefinedStateFunction[];
};

export const Functions = ({ address, functions }: FunctionsProps) => {
  if (functions.length === 0) return <div>No defined functions.</div>;
  return (
    <ul className="flex flex-col gap-4">
      {functions.map((func) => (
        <Func key={`${address}-${func.name}`} address={address} func={func} />
      ))}
    </ul>
  );
};
