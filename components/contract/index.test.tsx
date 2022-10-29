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
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import Contract from ".";

jest.mock("wagmi");

const useContractReadMock = useContractRead as jest.Mock<any>;

useContractReadMock.mockReturnValue({
  data: undefined,
  isLoading: false,
  isError: false,
  refetch: jest.fn(),
});

const usePrepareContractWriteMock = usePrepareContractWrite as jest.Mock<any>;
usePrepareContractWriteMock.mockReturnValue({ config: {} });

const useContractWriteMock = useContractWrite as jest.Mock<any>;
useContractWriteMock.mockReturnValue({ write: jest.fn() });

describe("Contract", () => {
  it("renders a loading message", () => {
    render(<Contract address="0x123" />);

    expect(screen.getByText("loading...")).toBeInTheDocument();
  });

  it("renders an error message", async () => {
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<Contract address="0x123" />);

    expect(await screen.findByText("error")).toBeInTheDocument();
  });

  it("renders a no contracts message", async () => {
    const address = buildAddress();
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => {
        return res(ctx.json([]));
      })
    );

    render(<Contract address={address} />);

    expect(await screen.findByText("no contracts")).toBeInTheDocument();
  });

  it("renders a selected contract", async () => {
    const contracts = buildContractDetailsList(2);
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => {
        return res(ctx.json(contracts));
      })
    );

    render(<Contract address={contracts[0].address} />);

    expect(
      await screen.findByRole("heading", { level: 3, name: contracts[0].name })
    ).toBeInTheDocument();
  });

  it("renders a selected contract not found message", async () => {
    const contract = buildContractDetailsList(2);
    const address = buildAddress();
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => {
        return res(ctx.json([contract]));
      })
    );

    render(<Contract address={address} />);

    expect(
      await screen.findByText("Selected contract not found.")
    ).toBeInTheDocument();
  });

  it("renders a list of defined functions", async () => {
    const definedFunctions = buildAbiDefinedFunctionList(2);
    const contract = buildContractDetails({ abi: [...definedFunctions] });
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => {
        return res(ctx.json([contract]));
      })
    );

    render(<Contract address={contract.address} />);

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
      rest.get("/api/contracts", (_req, res, ctx) => {
        return res(ctx.json([contract]));
      })
    );

    render(<Contract address={contract.address} />);

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
});
