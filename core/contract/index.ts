import { db } from "core/database";
import type { Address, ContractDetails } from "core/types";

const insert = async (data: ContractDetails) => {
  await db.read();
  db.data ||= { contracts: {} };
  db.data.contracts[data.address] = data;
  return db.write();
};

const findAll = async () => {
  await db.read();
  return Object.values(db.data?.contracts || {});
};

const remove = async (address: Address) => {
  await db.read();
  delete db.data?.contracts[address];
  return db.write();
};

const removeAll = async () => {
  await db.read();
  db.data ||= { contracts: {} };
  db.data.contracts = {};
  return db.write();
};

export const contract = {
  insert,
  findAll,
  remove,
  removeAll,
};
