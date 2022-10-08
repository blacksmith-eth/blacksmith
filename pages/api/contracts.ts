import contract from "core/contract";
import type { ContractDetails } from "core/types";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = ContractDetails[];

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const contracts = await contract.findAll();
  return res.status(200).json(contracts);
}
