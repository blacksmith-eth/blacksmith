import contract from "core/contract";
import type { Address } from "core/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const ETHERSCAN_API_KEY = req.body.key;
    return fetch(
      `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${req.query.address}&apikey=${ETHERSCAN_API_KEY}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const { ABI, ContractName, CompilerVersion } = data.result[0];
        contract.insert({
          abi: JSON.parse(ABI),
          address: req.query.address as Address,
          name: ContractName,
          version: CompilerVersion,
        });
        return res.status(200).json({});
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  }
  if (req.method === "DELETE") {
    await contract.remove(req.query.address as Address);
    return res.status(200).json({});
  }
  return res.status(405);
}
