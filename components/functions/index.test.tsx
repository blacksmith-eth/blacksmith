import { render, screen } from "testing";
import { buildAbiDefinedFunctionList, buildAddress } from "testing/factory";
import { PartialProps } from "testing/types";
import { Mock } from "vitest";
import { useContractRead, useContractWrite } from "wagmi";
import { Functions } from ".";

vi.mock("wagmi");

const useContractReadMock = useContractRead as Mock;

useContractReadMock.mockReturnValue({
  data: undefined,
  isError: false,
  isLoading: false,
  refetch: vi.fn(),
});

const useContractWriteMock = useContractWrite as Mock;
useContractWriteMock.mockReturnValue({ write: vi.fn() });

const renderFunctions = (props: PartialProps<typeof Functions> = {}) =>
  render(
    <Functions
      address={props.address || buildAddress()}
      functions={props.functions || []}
    />
  );

describe("Functions", () => {
  it("should render no functions message when no functions are provided", () => {
    renderFunctions({ functions: [] });

    expect(screen.getByText("No defined functions.")).toBeInTheDocument();
  });

  it("should render functions", () => {
    const functions = buildAbiDefinedFunctionList(2);

    renderFunctions({ functions });

    expect(
      screen.getByText(functions[0].name, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(functions[1].name, { exact: false })
    ).toBeInTheDocument();
  });
});
