import { contract } from "core/contract";
import { getAddress } from "core/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { compile } from "solc";
import { SafeParseReturnType, z } from "zod";
import { fromZodError } from "zod-validation-error";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import isNull from "lodash/isNull";
import { Address } from "core/types";

export enum Action {
  Verify = "verifysourcecode",
  Check = "checkverifystatus",
}

type ResponseData = {
  status: string;
  message: string;
  result: string;
};

const checkVerifyStatusRequestSchema = z.object({
  apikey: z.optional(z.string()),
  module: z.optional(z.string()),
  action: z.literal(Action.Check),
  guid: z.string(),
});

const verifyRequestSchema = z.object({
  apikey: z.optional(z.string()),
  module: z.optional(z.string()),
  action: z.literal(Action.Verify),
  contractaddress: z.custom<Address>().transform((value, context) => {
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
  contractname: z
    .string()
    .refine(
      (value) => value.includes(":"),
      `Expected string to match format "path:contractname"`
    ),
  compilerversion: z.string(),
  sourceCode: z.string(),
});

const safeParseReturnToEither = <I, O>(result: SafeParseReturnType<I, O>) =>
  result.success ? E.right(result.data) : E.left(result.error);

const verifyHandler = (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const result = verifyRequestSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      status: "0",
      message: "Error",
      result: fromZodError(result.error).toString(),
    });
  }
  try {
    const [file, name] = result.data.contractname.split(":");
    const compiled = JSON.parse(compile(result.data.sourceCode));
    const { abi } = compiled.contracts[file][name];
    contract.insert({
      abi,
      address: result.data.contractaddress as Address,
      name,
      version: result.data.compilerversion,
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

const checkHandler = (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => pipe(
    req.body,
    checkVerifyStatusRequestSchema.safeParse,
    safeParseReturnToEither,
    E.mapLeft(fromZodError),
    E.mapLeft((e) => e.toString()),
    E.match(
      (left) =>
        res.status(400).json({
          status: "0",
          message: "Error",
          result: left,
        }),
      (right) =>
        res.status(200).json({
          status: "1",
          message: "OK",
          result: `Contract verified! ID: ${right.guid}`,
        })
    )
  );

const invalidActionHandler = (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => res.status(400).json({
    status: "0",
    message: "Error",
    result: `Invalid action "${req.body.action}"`,
  });

export default function handler(
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
