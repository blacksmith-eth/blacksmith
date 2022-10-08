import { Address, ContractDetails } from "core/types";
import { faker } from "@faker-js/faker";

const buildAddress = () =>
  faker.datatype.hexadecimal({ length: 40 }) as Address;

const buildContractDetails = (): ContractDetails => ({
  address: buildAddress(),
  abi: [],
  name: faker.helpers.unique(faker.word.noun).toUpperCase(),
  version: "1.0.0",
});

export const buildContractDetailsList = (n: number): ContractDetails[] =>
  Array.from({ length: n }, () => buildContractDetails());
