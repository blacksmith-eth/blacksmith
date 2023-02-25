import { server } from "mocks/server";
import { rest } from "msw";
import mockRouter from "next-router-mock";
import { createDynamicRouteParser } from "next-router-mock/dynamic-routes";
import { render, screen } from "testing";
import { buildContractDetailsList } from "testing/factory";
import { Contracts } from ".";

const renderContracts = () => render(<Contracts />);

describe("Contracts", () => {
  beforeEach(() => {
    vi.mock("next/router", () => require("next-router-mock"));
    mockRouter.useParser(createDynamicRouteParser(["/contracts/[address]"]));
  });

  it("renders a loading message", () => {
    renderContracts();
    expect(screen.getByText("loading...")).toBeInTheDocument();
  });

  it("renders an error message", async () => {
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => res(ctx.status(500)))
    );
    renderContracts();
    expect(await screen.findByText("error")).toBeInTheDocument();
  });

  it("renders a no contracts message", async () => {
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => res(ctx.json([])))
    );
    renderContracts();
    expect(await screen.findByText("No contracts")).toBeInTheDocument();
  });

  it("renders a list of contracts", async () => {
    const contracts = buildContractDetailsList(2);
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => res(ctx.json(contracts)))
    );
    renderContracts();
    expect(
      await screen.findByRole("link", { name: contracts[0].name })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: contracts[1].name })
    ).toBeInTheDocument();
  });

  it("renders the active contract in bold", async () => {
    const contracts = buildContractDetailsList(2);
    mockRouter.push(`/contracts/${contracts[0].address}`);
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => res(ctx.json(contracts)))
    );
    renderContracts();

    expect(
      await screen.findByRole("link", { name: contracts[0].name })
    ).toHaveClass("font-semibold");
    expect(
      await screen.findByRole("link", { name: contracts[1].name })
    ).not.toHaveClass("font-semibold");
  });
});
