import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import type { Address, ContractDetails } from "core/types";

type Contracts = {
  [key: Address]: ContractDetails;
};

type Data = {
  contracts: Contracts;
};

const file = ".database.json";
const adapter = new JSONFile<Data>(file);
const defaultData: Data = { contracts: {} };
const db = new Low(adapter, defaultData);

export { db };
