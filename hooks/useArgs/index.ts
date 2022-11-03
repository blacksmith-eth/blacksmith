import { AbiParameterWithComponents, Arg } from "core/types";
import { BigNumber } from "ethers";
import { useCallback, useState } from "react";

const tryBigNumberConversion = (value: string): BigNumber | string => {
  try {
    return BigNumber.from(value);
  } catch {
    return value;
  }
};

const formatArgs = (args: Arg[]): any => {
  return args.reduce(
    (acc, arg) => ({
      ...acc,
      [arg.name]: formatArgsByType(arg),
    }),
    {}
  );
};

const formatArgsByType = (arg: Arg): any => {
  if (typeof arg.value !== "string") {
    return formatArgs(arg.value);
  }
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

const buildArg = (input: AbiParameterWithComponents): Arg => {
  return {
    name: input.name,
    type: input.type,
    value: input.components ? input.components.map(buildArg) : "",
  };
};

export const useArgs = (inputs: readonly AbiParameterWithComponents[]) => {
  const initialArgs = inputs.map(buildArg);
  const [args, setArgs] = useState<readonly Arg[]>(initialArgs);

  const updater = useCallback(
    (arg: Arg, value: string, keys: number[]): Arg => {
      if (typeof arg.value === "string") {
        return {
          ...arg,
          value,
        };
      }
      const [key, ...rest] = keys;
      return {
        ...arg,
        value: arg.value.map((arg, index) =>
          index === key ? updater(arg, value, rest) : arg
        ),
      };
    },
    []
  );

  const updateValue = useCallback(
    (keys: number[], value: string) => {
      const [key, ...rest] = keys;
      const updatedValues = args.map((arg, i) =>
        i === key ? updater(arg, value, rest) : arg
      );
      setArgs(updatedValues);
    },
    [args, updater]
  );

  const formattedArgs = args.map(formatArgsByType);

  return { args, formattedArgs, updateValue };
};
