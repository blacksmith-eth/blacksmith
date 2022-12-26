import { AbiDefinedFunction, AbiParameterWithComponents } from "core/types";

type SignatureProps = {
  func: AbiDefinedFunction;
};

const getType = (output: AbiParameterWithComponents): string => {
  if (output.type === "tuple") {
    return `(${output.components
      ?.map((component) => getType(component as AbiParameterWithComponents))
      .join(", ")})`;
  }
  return output.type;
};

const getReturnType = (
  outputs: readonly AbiParameterWithComponents[]
): string => {
  if (outputs.length === 0) return "void";
  if (outputs.length === 1) return getType(outputs[0]);
  return `[${outputs.map((output) => getType(output)).join(", ")}]`;
};

export const Signature = ({ func }: SignatureProps) => {
  const returnType = getReturnType(
    func.outputs as AbiParameterWithComponents[]
  );

  return (
    <div className="flex items-center gap-2">
      <h4 className="font-bold">
        {func.name} &#8594; {returnType}
      </h4>
      <span className="text-xs font-medium border border-black dark:border-white rounded px-1 py-0.5">
        {func.stateMutability}
      </span>
    </div>
  );
};
