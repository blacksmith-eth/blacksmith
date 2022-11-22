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
  if (arg.type !== "tuple" && Array.isArray(arg.value)) {
    return arg.value.map(formatArgsByType);
  }
  if (arg.type === "tuple" && typeof arg.value !== "string") {
    return formatArgs(arg.value);
  }
  if (arg.type === "uint256" && typeof arg.value === "string") {
    return tryBigNumberConversion(arg.value);
  }
  return arg.value;
};

const buildArg = (input: AbiParameterWithComponents): Arg => {
  return {
    name: input.name || input.type,
    type: input.type,
    value:
      input.type.slice(-2) === "[]"
        ? []
        : input.components
        ? input.components.map(buildArg)
        : "",
    childArg:
      input.type.slice(-2) === "[]"
        ? input.components
          ? buildArg({
              name: input.type.slice(0, -2),
              type: input.type.slice(0, -2),
              components: input.components,
            })
          : buildArg({
              type: input.type.slice(0, -2),
              name: input.type.slice(0, -2),
            })
        : undefined,
  };
};

export const useArgs = (inputs: readonly AbiParameterWithComponents[]) => {
  const initialArgs = inputs.map(buildArg);
  const [args, setArgs] = useState<readonly Arg[]>(initialArgs);

  const updater = useCallback(
    (arg: Arg, value: string | Arg[], keys: number[]): Arg => {
      if (typeof arg.value === "string") {
        return { ...arg, value };
      }
      const [key, ...rest] = keys;
      if (key === undefined) {
        return { ...arg, value };
      }
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
    (keys: number[], value: string | Arg[]) => {
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
