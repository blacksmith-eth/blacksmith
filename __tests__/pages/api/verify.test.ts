import { createMocks } from "node-mocks-http";
import verifyHandler, { Action } from "pages/api/verify";

describe("handler", () => {
  it("#check should return an error when guid is not specified", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { action: Action.Check },
    });

    await verifyHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      status: "0",
      message: "Error",
      result: `Error: Validation error: Required at "guid"`,
    });
  });

  it("#check should return an error when guid is not a string", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { action: Action.Check, guid: 123 },
    });

    await verifyHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      status: "0",
      message: "Error",
      result: `Error: Validation error: Expected string, received number at "guid"`,
    });
  });

  it("#check should return a success response when guid is valid", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { action: Action.Check, guid: "123" },
    });

    await verifyHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      status: "1",
      message: "OK",
      result: "Contract verified! ID: 123",
    });
  });
});
