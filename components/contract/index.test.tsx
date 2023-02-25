import { server } from "mocks/server";
import { rest } from "msw";
import { render, screen, waitFor } from "testing";
import {
  buildAbiDefinedFunction,
  buildAbiDefinedFunctionList,
  buildAbiError,
  buildAbiEvent,
  buildAddress,
  buildContractDetails,
  buildContractDetailsList,
} from "testing/factory";
import { PartialProps } from "testing/types";
import type { Mock } from "vitest";
import { useBalance, useContractRead, useContractWrite } from "wagmi";
import { Contract } from ".";

vi.mock("wagmi");

const useContractReadMock = useContractRead as Mock;

useContractReadMock.mockReturnValue({
  data: undefined,
  isError: false,
  isLoading: false,
  refetch: vi.fn(),
});

const useBalanceMock = useBalance as Mock;

useBalanceMock.mockReturnValue({
  data: undefined,
  isError: false,
  isLoading: false,
});

const useContractWriteMock = useContractWrite as Mock;
useContractWriteMock.mockReturnValue({ write: vi.fn() });

const renderContract = (props: PartialProps<typeof Contract> = {}) =>
  render(<Contract address={props.address || buildAddress()} />);

describe("Contract", () => {
  it("renders a loading message", () => {
    renderContract();

    expect(screen.getByText("loading...")).toBeInTheDocument();
  });

  it("renders an error message", async () => {
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => res(ctx.status(500)))
    );

    renderContract();

    expect(await screen.findByText("error")).toBeInTheDocument();
  });

  it("renders a selected contract", async () => {
    const contracts = buildContractDetailsList(2);
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => res(ctx.json(contracts)))
    );

    renderContract({ address: contracts[0].address });

    expect(
      await screen.findByRole("heading", { level: 3, name: contracts[0].name })
    ).toBeInTheDocument();
  });

  it("renders the selected contract not found page", async () => {
    const contract = buildContractDetailsList(2);
    const address = buildAddress();
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => res(ctx.json([contract])))
    );

    renderContract({ address });

    expect(
      await screen.findByText("Selected contract not found.")
    ).toBeInTheDocument();
    expect(await screen.findByText(address)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Getting Started" })
    ).toBeInTheDocument();
  });

  it("renders the contract address", async () => {
    const contract = buildContractDetails();
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => res(ctx.json([contract])))
    );

    renderContract({ address: contract.address });

    expect(
      await screen.findByRole("heading", { level: 4, name: contract.address })
    ).toBeInTheDocument();
  });

  it("renders a list of defined functions", async () => {
    const definedFunctions = buildAbiDefinedFunctionList(2);
    const contract = buildContractDetails({ abi: [...definedFunctions] });
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => res(ctx.json([contract])))
    );

    renderContract({ address: contract.address });

    expect(
      await screen.findByText(definedFunctions[0].name, { exact: false })
    ).toBeInTheDocument();
    expect(
      await screen.findByText(definedFunctions[1].name, { exact: false })
    ).toBeInTheDocument();
  });

  it("filters out non-function abi items", async () => {
    const event = buildAbiEvent();
    const error = buildAbiError();
    const definedFunction = buildAbiDefinedFunction();
    const abi = [event, error, definedFunction];
    const contract = buildContractDetails({ abi });
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => res(ctx.json([contract])))
    );

    renderContract({ address: contract.address });

    await waitFor(() => {
      expect(
        screen.queryByText(event.name, { exact: false })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(error.name, { exact: false })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(definedFunction.name, { exact: false })
      ).toBeInTheDocument();
    });
  });

  it("renders a button to copy the address", async () => {
    const contract = buildContractDetails();
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => res(ctx.json([contract])))
    );

    const { user } = renderContract({ address: contract.address });

    const copyButton = await screen.findByRole("button", {
      name: "Copy Address",
    });

    await user.click(copyButton);

    const copiedText = await navigator.clipboard.readText();
    expect(copiedText).toEqual(contract.address);
  });
});
