import contract from "core/contract";
import type { Address } from "core/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    await contract.remove(req.query.address as Address);
    return res.status(200).json({});
  }
  return res.status(405);
}
