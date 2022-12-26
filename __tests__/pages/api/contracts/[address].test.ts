import { contract } from "core/contract";
import { getAddress } from "core/utils";
import { server } from "mocks/server";
import { rest } from "msw";
import { createMocks } from "node-mocks-http";
import contractsAddressHandler from "pages/api/contracts/[address]";
import { buildAddress } from "testing/factory";

describe("handler", () => {
  it("should return 405 when method is not allowed", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await contractsAddressHandler(req, res);

    expect(res.statusCode).toBe(405);
  });

  it("should return 400 when address is invalid (DELETE)", async () => {
    const invalidAddress = "0x123";
    const { req, res } = createMocks({
      method: "DELETE",
      query: {
        address: invalidAddress,
      },
    });

    await contractsAddressHandler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("should return 200 when address is valid (DELETE)", async () => {
    const address = buildAddress();
    const spy = vi
      .spyOn(contract, "remove")
      .mockImplementationOnce(() => Promise.resolve());
    const { req, res } = createMocks({
      method: "DELETE",
      query: { address },
    });

    await contractsAddressHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(spy).toHaveBeenCalledWith(getAddress(address));
  });

  it("should return 400 when address is invalid (POST)", async () => {
    const { req, res } = createMocks({
      method: "POST",
      query: {
        address: "0x123",
      },
    });

    await contractsAddressHandler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("should return 200 when address is valid (POST)", async () => {
    const address = buildAddress();
    const spy = vi
      .spyOn(contract, "insert")
      .mockImplementationOnce(() => Promise.resolve());
    const contractResponse = {
      ABI: "[]",
      ContractName: "Test",
      CompilerVersion: "0.8.0",
    };
    server.use(
      rest.get("https://api.etherscan.io/api", (_req, res, ctx) => {
        return res(
          ctx.json({
            result: [contractResponse],
          })
        );
      })
    );
    const { req, res } = createMocks({
      method: "POST",
      query: { address },
    });

    await contractsAddressHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(spy).toHaveBeenCalledWith({
      abi: [],
      address: getAddress(address),
      name: contractResponse.ContractName,
      version: contractResponse.CompilerVersion,
    });
  });

  it("should return 500 when address is valid and request fails (POST)", async () => {
    const address = buildAddress();
    server.use(
      rest.get("https://api.etherscan.io/api", (_req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    const { req, res } = createMocks({
      method: "POST",
      query: { address },
    });

    await contractsAddressHandler(req, res);

    expect(res.statusCode).toBe(500);
  });
});
