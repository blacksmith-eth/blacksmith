import { AbiParameter, Arg } from "core/types";
import { BigNumber } from "ethers";
import { useState } from "react";

const tryBigNumberConversion = (value: string): BigNumber | string => {
  try {
    return BigNumber.from(value);
  } catch {
    return value;
  }
};

const formatArgsByType = (arg: Arg): any => {
  if (arg.type.slice(-2) === "[]") {
    return arg.value.split(",").map((value) =>
      formatArgsByType({
        ...arg,
        type: arg.type.slice(0, -2),
        value: value.trim(),
      })
    );
  }
  if (arg.type === "uint256") {
    return tryBigNumberConversion(arg.value);
  }
  return arg.value;
};

export const useArgs = (inputs: readonly AbiParameter[]) => {
  const initialArgs = inputs.map((input) => ({
    name: input.name,
    type: input.type,
    value: "",
  }));
  const [args, setArgs] = useState<readonly Arg[]>(initialArgs);

  const updateValue = (index: number, value: string) => {
    const updatedValues = args.map((arg, i) =>
      i === index ? { ...arg, value } : arg
    );
    setArgs(updatedValues);
  };

  const formattedArgs = args.map(formatArgsByType);

  return { args, formattedArgs, updateValue };
};
