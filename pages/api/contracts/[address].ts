import contract from "core/contract";
import type { Address } from "core/types";
import type { NextApiRequest, NextApiResponse } from "next";

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
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
        address: req.query.address as Address,
        name: ContractName,
        version: CompilerVersion,
      });
      return res.status(200).json({});
    })
    .catch((error) => res.status(500).json(error));
};

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await contract.remove(req.query.address as Address);
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
