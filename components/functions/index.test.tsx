import { render, screen } from "testing";
import { buildAbiDefinedFunctionList, buildAddress } from "testing/factory";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import Functions from ".";

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

const renderFunctions = (
  props: Partial<React.ComponentProps<typeof Functions>> = {}
) => {
  return render(
    <Functions
      address={props.address || buildAddress()}
      functions={props.functions || []}
    />
  );
};

describe("Functions", () => {
  it("should render no functions message when no functions are provided", () => {
    renderFunctions({ functions: [] });

    expect(screen.getByText("no functions")).toBeInTheDocument();
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
