import { AbiDefinedFunction, AbiParameter } from "core/types";

type SignatureProps = {
  func: AbiDefinedFunction;
};

const getReturnType = (outputs: readonly AbiParameter[]) => {
  if (outputs.length === 0) return "void";
  if (outputs.length === 1) return outputs[0].type;
  return `(${outputs.map((output) => output.type).join(", ")})`;
};

const Signature = ({ func }: SignatureProps) => {
  const returnType = getReturnType(func.outputs);

  return (
    <div className="flex items-center gap-2">
      <h4 className="font-bold">
        {func.name} &#8594; {returnType}
      </h4>
      <span className="text-sm border rounded px-2 py-0.5">
        {func.stateMutability}
      </span>
    </div>
  );
};

export default Signature;
