import type { Abi, Address } from "abitype";

export type ContractDetails = {
  abi: Abi;
  address: Address;
  name: string;
  version: string;
};

export * from "abitype";
