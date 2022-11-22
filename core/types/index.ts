import type { Abi, AbiParameter, AbiStateMutability, Address } from "abitype";

export type Arg = {
  name: string;
  type: string;
  value: Arg[] | string;
  childArg: Arg | undefined;
};

export type AbiDefinedFunction = {
  inputs: readonly AbiParameter[];
  name: string;
  outputs: readonly AbiParameter[];
  stateMutability: AbiStateMutability;
  type: "function";
};

export type AbiParameterWithComponents = AbiParameter & {
  components?: AbiParameterWithComponents[];
};

export type ContractDetails = {
  abi: Abi;
  address: Address;
  name: string;
  version: string;
};

export * from "abitype";
