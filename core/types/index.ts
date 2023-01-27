import type { Abi, AbiParameter, AbiStateMutability, Address } from "abitype";
import { BigNumber } from "ethers";

export type Arg = {
  name: string;
  type: string;
  value: Arg[] | string;
  childArg: Arg | undefined;
  isInfinite: boolean;
  isTouched: boolean;
};

type AbiDefinedFunction = {
  inputs: readonly AbiParameter[];
  name: string;
  outputs: readonly AbiParameter[];
  stateMutability: AbiStateMutability;
  type: "function";
};

export type AbiDefinedNonpayableFunction = AbiDefinedFunction & {
  stateMutability: "nonpayable";
};

export type AbiDefinedPayableFunction = AbiDefinedFunction & {
  stateMutability: "payable";
};

export type AbiDefinedPureFunction = AbiDefinedFunction & {
  stateMutability: "pure";
};

export type AbiDefinedViewFunction = AbiDefinedFunction & {
  stateMutability: "view";
};

export type AbiDefinedStateFunction =
  | AbiDefinedNonpayableFunction
  | AbiDefinedPayableFunction
  | AbiDefinedPureFunction
  | AbiDefinedViewFunction;

export type AbiParameterWithComponents = AbiParameter & {
  components?: AbiParameterWithComponents[];
};

export type ContractDetails = {
  abi: Abi;
  address: Address;
  name: string;
  version: string;
};

export type Result = string | BigNumber | undefined | null | Result[];

export * from "abitype";
