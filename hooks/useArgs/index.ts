import { AbiDefinedFunction } from "core/types";
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

export const useArgs = (func: AbiDefinedFunction) => {
  const [values, setValues] = useState<string[]>(
    Array.from({ length: func.inputs.length }, () => "")
  );

  const updateValue = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
  };

  const args = values.map((value, index) => {
    const { type } = func.inputs[index];
    return formatArgsByType(type, value);
  });

  return { args, values, updateValue };
};
