import { AbiParameterWithComponents, Arg } from "core/types";
import { BigNumber } from "ethers";
import times from "lodash/times";
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
  if (arg.type === "bool") {
    return arg.value === "true";
  }
  return arg.value;
};

const extractType = (
  type: string
): { baseType: string; arrayType: number | "none" | "infinite" } => {
  const arrayType = type.match(/\[([0-9]*)\]$/);
  if (arrayType) {
    const baseType = type.slice(0, arrayType.index);
    return {
      baseType,
      arrayType: arrayType[1] === "" ? "infinite" : parseInt(arrayType[1]),
    };
  }
  return {
    baseType: type,
    arrayType: "none",
  };
};

const buildValues = (input: AbiParameterWithComponents): Arg[] | string => {
  const { baseType, arrayType } = extractType(input.type);
  if (arrayType === "infinite") {
    return [];
  }
  if (typeof arrayType === "number") {
    return times(arrayType, () => buildArg({ name: baseType, type: baseType }));
  }
  if (input.components) {
    return input.components.map(buildArg);
  }
  return "";
};

const buildChildArg = (input: AbiParameterWithComponents): Arg | undefined => {
  const { baseType, arrayType } = extractType(input.type);
  if (typeof arrayType === "number") {
    return undefined;
  }
  if (arrayType === "infinite") {
    return input.components
      ? buildArg({
          name: baseType,
          type: baseType,
          components: input.components,
        })
      : buildArg({
          type: baseType,
          name: baseType,
        });
  }
  return undefined;
};

const buildIsInfinite = (input: AbiParameterWithComponents): boolean => {
  const { arrayType } = extractType(input.type);
  return arrayType === "infinite";
};

const buildArg = (input: AbiParameterWithComponents): Arg => ({
  name: input.name || input.type,
  type: input.type,
  value: buildValues(input),
  childArg: buildChildArg(input),
  isInfinite: buildIsInfinite(input),
  isTouched: false,
});

const calculateTouched = (args: readonly Arg[]): boolean =>
  args.reduce((acc, arg) => {
    if (typeof arg.value === "string") {
      return acc && arg.isTouched;
    }
    return acc && calculateTouched(arg.value);
  }, true);

export const useArgs = (inputs: readonly AbiParameterWithComponents[]) => {
  const initialArgs = inputs.map(buildArg);
  const [args, setArgs] = useState<readonly Arg[]>(initialArgs);

  const updater = useCallback(
    (arg: Arg, value: string | Arg[], keys: number[]): Arg => {
      if (typeof arg.value === "string") {
        return { ...arg, isTouched: true, value };
      }
      const [key, ...rest] = keys;
      if (key === undefined) {
        return { ...arg, value };
      }
      return {
        ...arg,
        isTouched: true,
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

  const isTouched = calculateTouched(args);

  return { args, formattedArgs, updateValue, isTouched };
};
