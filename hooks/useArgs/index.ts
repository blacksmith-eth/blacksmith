import { AbiDefinedFunction } from "core/types";
import { useState } from "react";

export const useArgs = (func: AbiDefinedFunction) => {
  const [args, setArgs] = useState<string[]>(
    Array.from({ length: func.inputs.length }, () => "")
  );

  const updateArg = (index: number, value: string) => {
    const newArgs = [...args];
    newArgs[index] = value;
    setArgs(newArgs);
  };

  return { args, updateArg };
};
