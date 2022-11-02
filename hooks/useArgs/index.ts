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

export const useArgs = (inputs: readonly AbiParameter[]) => {
  const initialArgs = inputs.map((input) => ({
    name: input.name,
    type: input.type,
    value: "",
  }));
  const [values, setValues] = useState<readonly Arg[]>(initialArgs);

  const updateValue = (index: number, value: string) => {
    const updatedValues = values.map((arg, i) =>
      i === index ? { ...arg, value } : arg
    );
    setValues(updatedValues);
  };

  const args = values.map((arg) => {
    return formatArgsByType(arg.type, arg.value);
  });

  return { args, values, updateValue };
};
