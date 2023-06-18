import { contract } from "core/contract";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { Address } from "abitype/zod";

type ResponseData =
  | {
      result: ReadonlyArray<{
        status: "perfect";
      }>;
    }
  | {
      message: "Validation error";
      errors: ReadonlyArray<unknown>;
    };

const metadataSchema = z.object({
  compiler: z.object({
    version: z.string(),
  }),
  settings: z.object({
    compilationTarget: z.record(z.string()),
  }),
  output: z.object({
    abi: z.array(
      z.any().transform((value) => ({
        outputs: [],
        ...value,
      }))
    ),
  }),
});

const metadataStringSchema = z.string().transform((value) => {
  try {
    return metadataSchema.parse(JSON.parse(value));
  } catch (error) {
    throw new Error("Invalid metadata");
  }
});

const verifyRequestSchema = z.object({
  address: Address,
  files: z.object({
    "metadata.json": metadataStringSchema,
  }),
});

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const metadata = JSON.parse(req.body.files["metadata.json"]);
  const result = verifyRequestSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation error",
      errors: [],
    });
  }

  contract.insert({
    abi: result.data.files["metadata.json"].output.abi,
    address: result.data.address,
    name: Object.values(metadata.settings.compilationTarget)[0] as string,
    version: metadata.compiler.version,
  });

  return res.status(200).json({
    result: [
      {
        status: "perfect",
      },
    ],
  });
}
