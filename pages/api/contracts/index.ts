import { contract } from "core/contract";
import type { ContractDetails } from "core/types";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = ContractDetails[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "GET") {
    const contracts = await contract.findAll();
    return res.status(200).json(contracts);
  } else if (req.method === "DELETE") {
    await contract.removeAll();
    return res.status(200).json([]);
  }
  return res.status(405);
}
