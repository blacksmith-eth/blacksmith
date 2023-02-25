import { contract } from "core/contract";
import type { Address } from "core/types";
import { getAddress } from "core/utils";
import isNull from "lodash/isNull";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const BASE_URL = "https://api.etherscan.io";

const buildGetSourceCodeUrl = (address: Address) => {
  const apiKey = process.env.ETHERSCAN_API_KEY;
  return `${BASE_URL}/api?module=contract&action=getsourcecode&address=${address}${
    apiKey ? `&apikey=${apiKey}` : ""
  }`;
};

const requestSchema = z.object({
  address: z.custom<Address>().transform((value, context) => {
    const address = getAddress(value);
    if (isNull(address)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid address",
      });

      return z.NEVER;
    }
    return address;
  }),
});

const postHandler = (req: NextApiRequest, res: NextApiResponse) => {
  const result = requestSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ error: result.error.message });
  }
  return fetch(buildGetSourceCodeUrl(result.data.address), {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const [{ ABI, ContractName, CompilerVersion }] = data.result;
      contract.insert({
        abi: JSON.parse(ABI),
        address: result.data.address,
        name: ContractName,
        version: CompilerVersion,
      });
      return res.status(200).json({});
    })
    .catch((error) => res.status(500).json(error));
};

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const result = requestSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ error: result.error.message });
  }
  await contract.remove(result.data.address);
  return res.status(200).json({});
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      return postHandler(req, res);
    case "DELETE":
      return deleteHandler(req, res);
    default:
      return res.status(405);
  }
}
