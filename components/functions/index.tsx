import { AbiDefinedFunction, Address } from "core/types";
import { Function } from "components/function";

type FunctionsProps = {
  address: Address;
  functions: AbiDefinedFunction[];
};

export const Functions = ({ address, functions }: FunctionsProps) => {
  if (functions.length === 0) return <div>No defined functions.</div>;
  return (
    <ul className="flex flex-col gap-4">
      {functions.map((func) => (
        <Function
          key={`${address}-${func.name}`}
          address={address}
          func={func}
        />
      ))}
    </ul>
  );
};
