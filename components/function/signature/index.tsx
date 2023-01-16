import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction } from "react";
import { AbiDefinedFunction, AbiParameterWithComponents } from "core/types";

type SignatureProps = {
  func: AbiDefinedFunction;
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
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

export const Signature = ({
  func,
  collapsed,
  setCollapsed,
}: SignatureProps) => {
  const returnType = getReturnType(
    func.outputs as AbiParameterWithComponents[]
  );
  const handleCollapseToggle = () => {
    setCollapsed((collapsed) => !collapsed);
  };

  return (
    <div className="flex items-center gap-2">
      <h4 className="font-bold">
        {func.name} &#8594; {returnType}
      </h4>
      <span className="text-xs font-medium border border-black dark:border-white rounded px-1 py-0.5">
        {func.stateMutability}
      </span>
      <button
        className="inline p-0.5 mx-0.5 rounded-sm text-black dark:text-white focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black focus:outline-none"
        onClick={handleCollapseToggle}
      >
        {collapsed ? (
          <PlusIcon className="h-4 w-4" />
        ) : (
          <MinusIcon className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};
