import { server } from "mocks/server";
import { rest } from "msw";
import { render, screen } from "testing";
import { buildContractDetailsList } from "testing/factory";
import { Contracts } from ".";

describe("Contracts", () => {
  it("renders a loading message", () => {
    render(<Contracts />);
    expect(screen.getByText("loading...")).toBeInTheDocument();
  });

  it("renders an error message", async () => {
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    render(<Contracts />);
    expect(await screen.findByText("error")).toBeInTheDocument();
  });

  it("renders a no contracts message", async () => {
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => {
        return res(ctx.json([]));
      })
    );
    render(<Contracts />);
    expect(await screen.findByText("no contracts")).toBeInTheDocument();
  });

  it("renders a list of contracts", async () => {
    const contracts = buildContractDetailsList(2);
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => {
        return res(ctx.json(contracts));
      })
    );
    render(<Contracts />);
    expect(await screen.findByText(contracts[0].name)).toBeInTheDocument();
    expect(await screen.findByText(contracts[1].name)).toBeInTheDocument();
  });
});
