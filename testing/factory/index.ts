import {
  AbiDefinedFunction,
  AbiError,
  AbiEvent,
  AbiParameter,
  AbiParameterWithComponents,
  Address,
  Arg,
  ContractDetails,
} from "core/types";
import { faker } from "@faker-js/faker";
import capitalize from "lodash/capitalize";
import times from "lodash/times";
import { Result } from "ethers/lib/utils";

const RESERVED_WORDS = ["value"];

export const buildAbiEvent = (): AbiEvent => ({
  type: "event",
  inputs: [],
  name: capitalize(faker.helpers.unique(faker.word.verb)),
});

export const buildAbiError = (): AbiError => ({
  type: "error",
  inputs: [],
  name: capitalize(faker.helpers.unique(faker.word.adjective)),
});

export const buildAddress = () =>
  faker.datatype.hexadecimal({ length: 40, case: "lower" }) as Address;

export const buildContractDetails = (
  overrides: Partial<ContractDetails> = {}
): ContractDetails => ({
  address: overrides.address || buildAddress(),
  abi: overrides.abi || [],
  name: overrides.name || capitalize(faker.helpers.unique(faker.word.noun)),
  version: overrides.version || "1.0.0",
});

export const buildArg = (overrides: Partial<Arg> = {}): Arg => ({
  name: overrides.hasOwnProperty("name")
    ? overrides.name!
    : faker.helpers.unique(faker.word.noun),
  type: overrides.type || faker.helpers.arrayElement(["string", "address"]),
  value: overrides.hasOwnProperty("value") ? overrides.value! : "",
  isInfinite: overrides.isInfinite || false,
  isTouched: overrides.isTouched || false,
  childArg: overrides.hasOwnProperty("childArg")
    ? overrides.childArg
    : undefined,
});

export const buildArgList = (n: number): Arg[] => times(n, () => buildArg());

export const buildContractDetailsList = (n: number): ContractDetails[] =>
  times(n, () => buildContractDetails());

export const buildAbiDefinedFunction = (
  overrides: Partial<AbiDefinedFunction> = {}
): AbiDefinedFunction => ({
  name:
    overrides.name ||
    faker.helpers.unique(faker.word.noun, undefined, {
      exclude: RESERVED_WORDS,
    }),
  type: "function",
  inputs: overrides.inputs || [],
  outputs: overrides.outputs || [],
  stateMutability:
    overrides.stateMutability ||
    faker.helpers.arrayElement(["view", "pure", "nonpayable", "payable"]),
});

export const buildAbiDefinedFunctionList = (n: number): AbiDefinedFunction[] =>
  times(n, () => buildAbiDefinedFunction());

export const buildInput = (
  overrides: Partial<AbiParameter> = {}
): AbiParameter => ({
  name: overrides.hasOwnProperty("name")
    ? overrides.name!
    : faker.helpers.unique(faker.word.noun),
  type: overrides.type || faker.helpers.arrayElement(["address", "string"]),
});

export const buildInputList = (n: number): AbiParameter[] =>
  times(n, () => buildInput());

export const buildInputWithComponents = (
  overrides: Partial<AbiParameterWithComponents>
): AbiParameterWithComponents => ({
  name: faker.helpers.unique(faker.word.noun),
  type: overrides.type || faker.helpers.arrayElement(["address", "string"]),
  components: overrides.components,
});

export const buildOutput = (
  overrides: Partial<AbiParameterWithComponents> = {}
): AbiParameter => ({
  name: overrides.name || faker.helpers.unique(faker.word.noun),
  type:
    overrides.type ||
    faker.helpers.arrayElement(["uint256", "address", "string"]),
  components: overrides.components || undefined,
});

export const buildOutputList = (n: number): AbiParameter[] =>
  times(n, () => buildOutput());

export const buildResult = (value: any): Result => value as Result;

export const buildTransactionHash = () =>
  faker.datatype.hexadecimal({ length: 64, case: "lower" });
