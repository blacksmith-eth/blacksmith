import { AbiDefinedFunction } from "core/types";
import { BigNumber } from "ethers";
import { useState } from "react";

const tryBigNumberConversion = (value: string): BigNumber | string => {
  try {
    return BigNumber.from(value);
  } catch (_error) {
    return value;
  }
};

const formatArgsByType = (type: string, arg: string): any => {
  if (type.slice(-2) === "[]") {
    return arg
      .split(",")
      .map((value) => formatArgsByType(type.slice(0, -2), value.trim()));
  }
  if (type === "uint256") {
    return tryBigNumberConversion(arg);
  }
  return arg;
};

export const useArgs = (func: AbiDefinedFunction) => {
  const [args, setArgs] = useState<string[]>(
    Array.from({ length: func.inputs.length }, () => "")
  );

  const updateArg = (index: number, value: string) => {
    const newArgs = [...args];
    newArgs[index] = value;
    setArgs(newArgs);
  };

  const formattedArgs = args.map((arg, index) => {
    const { type } = func.inputs[index];
    return formatArgsByType(type, arg);
  });

  return { args, formattedArgs, updateArg };
};
