import { contract } from "core/contract";
import { createMocks } from "node-mocks-http";
import contractsHandler from "pages/api/contracts";

describe("handler", () => {
  it("should return 405 when method is not allowed", async () => {
    const { req, res } = createMocks({ method: "POST" });

    await contractsHandler(req, res);

    expect(res.statusCode).toBe(405);
  });

  it("should return 200 when requesting all contracts", async () => {
    const spy = vi
      .spyOn(contract, "findAll")
      .mockImplementationOnce(() => Promise.resolve([]));
    const { req, res } = createMocks({ method: "GET" });

    await contractsHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual([]);
    expect(spy).toHaveBeenCalled();
  });

  it("should return 200 when requesting removal of all contracts", async () => {
    const spy = vi
      .spyOn(contract, "removeAll")
      .mockImplementationOnce(() => Promise.resolve());
    const { req, res } = createMocks({ method: "DELETE" });

    await contractsHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual([]);
    expect(spy).toHaveBeenCalled();
  });
});
