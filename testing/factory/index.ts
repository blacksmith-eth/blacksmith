import {
  AbiDefinedNonpayableFunction,
  AbiDefinedPayableFunction,
  AbiDefinedPureFunction,
  AbiDefinedStateFunction,
  AbiDefinedViewFunction,
  AbiError,
  AbiEvent,
  AbiParameter,
  AbiParameterWithComponents,
  Address,
  Arg,
  ContractDetails,
  Result,
} from "core/types";
import { faker } from "@faker-js/faker/locale/en";
import capitalize from "lodash/capitalize";
import times from "lodash/times";

const RESERVED_WORDS = ["value", "unit"];

const { unique } = faker.helpers;

const uniqueOptions = { exclude: RESERVED_WORDS };

const adjective = () => unique(faker.word.adjective, undefined, uniqueOptions);
const noun = () => unique(faker.word.noun, undefined, uniqueOptions);
const verb = () => unique(faker.word.verb, undefined, uniqueOptions);

const hasProperty = (obj: any, property: string) =>
  Object.prototype.hasOwnProperty.call(obj, property);

export const buildAbiEvent = (): AbiEvent => ({
  type: "event",
  inputs: [],
  name: capitalize(verb()),
});

export const buildAbiError = (): AbiError => ({
  type: "error",
  inputs: [],
  name: capitalize(adjective()),
});

export const buildAddress = () =>
  faker.datatype.hexadecimal({ length: 40, case: "lower" }) as Address;

export const buildContractDetails = (
  overrides: Partial<ContractDetails> = {}
): ContractDetails => ({
  address: overrides.address || buildAddress(),
  abi: overrides.abi || [],
  name: overrides.name || capitalize(noun()),
  version: overrides.version || "1.0.0",
});

export const buildArg = (overrides: Partial<Arg> = {}): Arg => ({
  name:
    hasProperty(overrides, "name") && overrides.name ? overrides.name : noun(),
  type: overrides.type || faker.helpers.arrayElement(["string", "address"]),
  value:
    hasProperty(overrides, "value") && overrides.value ? overrides.value : "",
  isInfinite: overrides.isInfinite || false,
  isTouched: overrides.isTouched || false,
  childArg: hasProperty(overrides, "childArg") ? overrides.childArg : undefined,
});

export const buildArgList = (n: number): Arg[] => times(n, () => buildArg());

export const buildContractDetailsList = (n: number): ContractDetails[] =>
  times(n, () => buildContractDetails());

export const buildAbiDefinedFunction = (
  overrides: Partial<AbiDefinedStateFunction> = {}
): AbiDefinedStateFunction => ({
  name: overrides.name || noun(),
  type: "function",
  inputs: overrides.inputs || [],
  outputs: overrides.outputs || [],
  stateMutability:
    overrides.stateMutability ||
    faker.helpers.arrayElement(["view", "pure", "nonpayable", "payable"]),
});

export const buildAbiDefinedNonpayableFunction = (
  overrides: Partial<AbiDefinedNonpayableFunction> = {}
): AbiDefinedNonpayableFunction => ({
  ...buildAbiDefinedFunction(overrides),
  stateMutability: "nonpayable",
});

export const buildAbiDefinedPayableFunction = (
  overrides: Partial<AbiDefinedPayableFunction> = {}
): AbiDefinedPayableFunction => ({
  ...buildAbiDefinedFunction(overrides),
  stateMutability: "payable",
});

export const buildAbiDefinedPureFunction = (
  overrides: Partial<AbiDefinedPureFunction> = {}
): AbiDefinedPureFunction => ({
  ...buildAbiDefinedFunction(overrides),
  stateMutability: "pure",
});

export const buildAbiDefinedViewFunction = (
  overrides: Partial<AbiDefinedViewFunction> = {}
): AbiDefinedViewFunction => ({
  ...buildAbiDefinedFunction(overrides),
  stateMutability: "view",
});

export const buildAbiDefinedFunctionList = (
  n: number
): AbiDefinedStateFunction[] => times(n, () => buildAbiDefinedFunction());

export const buildInput = (
  overrides: Partial<AbiParameter> = {}
): AbiParameter => ({
  name: hasProperty(overrides, "name") ? overrides.name : noun(),
  type: overrides.type || faker.helpers.arrayElement(["address", "string"]),
});

export const buildInputList = (n: number): AbiParameter[] =>
  times(n, () => buildInput());

export const buildInputWithComponents = (
  overrides: Partial<AbiParameterWithComponents>
): AbiParameterWithComponents => ({
  name: noun(),
  type: overrides.type || faker.helpers.arrayElement(["address", "string"]),
  components: overrides.components,
});

export const buildOutput = (
  overrides: Partial<AbiParameterWithComponents> = {}
): AbiParameter => ({
  name: overrides.name || noun(),
  type:
    overrides.type ||
    faker.helpers.arrayElement(["uint256", "address", "string"]),
  components: overrides.components || undefined,
});

export const buildOutputList = (n: number): AbiParameter[] =>
  times(n, () => buildOutput());

export const buildResult = (value: Result) => value;

export const buildTransactionHash = () =>
  faker.datatype.hexadecimal({ length: 64, case: "lower" });
