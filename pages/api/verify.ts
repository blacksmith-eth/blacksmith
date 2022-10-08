import contract from "core/contract";
import type { NextApiRequest, NextApiResponse } from "next";
import { compile } from "solc";

export enum Action {
  Verify = "verifysourcecode",
  Check = "checkverifystatus",
}

type ResponseData = {
  status: string;
  message: string;
  result: string;
};

const verifyHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  try {
    const [file, name] = req.body.contractname.split(":");
    const compiled = JSON.parse(compile(req.body.sourceCode));
    const { abi } = compiled.contracts[file][name];
    contract.insert({
      abi,
      address: req.body.contractaddress,
      name,
      version: req.body.compilerversion,
    });
  } catch (error) {
    return res.status(500).json({
      status: "0",
      message: "Error",
      result: "Failed to compile and save contract",
    });
  }

  return res.status(200).json({
    status: "1",
    message: `Verifying contract "${req.body.contractname}"`,
    result: req.body.contractaddress,
  });
};

const checkHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  return res.status(200).json({
    status: "1",
    message: "OK",
    result: `Contract verified! ID: ${req.body.guid}`,
  });
};

const invalidActionHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  return res.status(400).json({
    status: "0",
    message: "Error",
    result: `Invalid action "${req.body.action}"`,
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  switch (req.body.action) {
    case Action.Verify:
      return verifyHandler(req, res);
    case Action.Check:
      return checkHandler(req, res);
    default:
      return invalidActionHandler(req, res);
  }
}
