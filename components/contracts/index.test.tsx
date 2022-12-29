import { AddressZero } from "core/constants";
import { server } from "mocks/server";
import { rest } from "msw";
import { ComponentProps } from "react";
import { render, screen } from "testing";
import { buildContractDetailsList } from "testing/factory";
import { Contracts } from ".";

const renderContracts = (
  props: Partial<ComponentProps<typeof Contracts>> = {}
) => {
  const activeContract = AddressZero;
  const setActiveContract = vi.fn();
  return render(
    <Contracts
      activeContract={activeContract}
      setActiveContract={setActiveContract}
      {...props}
    />
  );
};

describe("Contracts", () => {
  it("renders a loading message", () => {
    renderContracts();
    expect(screen.getByText("loading...")).toBeInTheDocument();
  });

  it("renders an error message", async () => {
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    renderContracts();
    expect(await screen.findByText("error")).toBeInTheDocument();
  });

  it("renders a no contracts message", async () => {
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => {
        return res(ctx.json([]));
      })
    );
    renderContracts();
    expect(await screen.findByText("No contracts")).toBeInTheDocument();
  });

  it("renders a list of contracts", async () => {
    const contracts = buildContractDetailsList(2);
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => {
        return res(ctx.json(contracts));
      })
    );
    renderContracts();
    expect(
      await screen.findByRole("button", { name: contracts[0].name })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: contracts[1].name })
    ).toBeInTheDocument();
  });

  it("calls setActiveContract when a contract is clicked", async () => {
    const setActiveContract = vi.fn();
    const contracts = buildContractDetailsList(2);
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => {
        return res(ctx.json(contracts));
      })
    );
    const { user } = renderContracts({ setActiveContract });

    expect(await screen.findByText(contracts[0].name)).toBeInTheDocument();
    expect(await screen.findByText(contracts[1].name)).toBeInTheDocument();
    expect(setActiveContract).not.toHaveBeenCalled();

    await user.click(
      await screen.findByRole("button", { name: contracts[0].name })
    );

    expect(setActiveContract).toHaveBeenCalledWith(contracts[0].address);
  });

  it("renders the active contract in bold", async () => {
    const contracts = buildContractDetailsList(2);
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => {
        return res(ctx.json(contracts));
      })
    );
    renderContracts({ activeContract: contracts[0].address });

    expect(await screen.findByText(contracts[0].name)).toBeInTheDocument();
    expect(await screen.findByText(contracts[1].name)).toBeInTheDocument();

    expect(
      await screen.findByRole("button", { name: contracts[0].name })
    ).toHaveClass("font-semibold");
    expect(
      await screen.findByRole("button", { name: contracts[1].name })
    ).not.toHaveClass("font-semibold");
  });
});
