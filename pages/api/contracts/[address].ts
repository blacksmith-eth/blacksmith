import contract from "core/contract";
import type { Address } from "core/types";
import { getAddress } from "core/utils";
import type { NextApiRequest, NextApiResponse } from "next";

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const address = getAddress(req.query.address as Address);
  if (!address) {
    return res.status(400).json({ error: "Invalid address" });
  }
  return fetch(
    `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${req.query.address}`,
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
        address,
        name: ContractName,
        version: CompilerVersion,
      });
      return res.status(200).json({});
    })
    .catch((error) => res.status(500).json(error));
};

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const address = getAddress(req.query.address as Address);
  if (!address) {
    return res.status(400).json({ error: "Invalid address" });
  }
  await contract.remove(address);
  return res.status(200).json({});
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return postHandler(req, res);
    case "DELETE":
      return deleteHandler(req, res);
    default:
      return res.status(405);
  }
}
