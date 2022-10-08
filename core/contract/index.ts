import { db } from "core/database";
import type { ContractDetails } from "core/types";

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

const contract = {
  insert,
  findAll,
};

export default contract;
