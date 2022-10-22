import { ComponentProps } from "react";
import { render, screen, waitFor } from "testing";
import {
  buildAbiDefinedFunction,
  buildAddress,
  buildInputList,
} from "testing/factory";
import { useContractRead } from "wagmi";
import View from ".";

jest.mock("wagmi");

const useContractReadMock = useContractRead as jest.Mock<any>;

useContractReadMock.mockReturnValue({
  data: undefined,
  isLoading: false,
  isError: false,
  refetch: jest.fn(),
});

const renderView = (props: Partial<ComponentProps<typeof View>> = {}) => {
  return render(
    <View
      address={props.address || buildAddress()}
      func={props.func || buildAbiDefinedFunction()}
    />
  );
};

describe("View", () => {
  beforeEach(jest.clearAllMocks);

  it("should render function name", () => {
    const func = buildAbiDefinedFunction();

    renderView({ func });

    expect(screen.getByText(func.name, { exact: false })).toBeInTheDocument();
  });

  it("should render function inputs", () => {
    const inputs = buildInputList(2);
    const func = buildAbiDefinedFunction({ inputs });

    renderView({ func });

    func.inputs.forEach((input) => {
      expect(
        screen.getByLabelText(`${input.name} :: ${input.type}`)
      ).toBeInTheDocument();
    });
  });

  it("should refetch on read button click", () => {
    const refetch = jest.fn();
    useContractReadMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      refetch,
    });

    renderView();

    screen.getByText("read").click();

    expect(refetch).toHaveBeenCalled();
  });

  it("should render data when data is defined", () => {
    const data = "foo";
    useContractReadMock.mockReturnValue({
      data,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    renderView();

    expect(screen.getByText(data)).toBeInTheDocument();
  });

  it("should render loading when isLoading is true", () => {
    useContractReadMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: jest.fn(),
    });

    renderView();

    expect(screen.getByText("loading...")).toBeInTheDocument();
  });

  it("should render error when isError is true", () => {
    useContractReadMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: jest.fn(),
    });

    renderView();

    expect(screen.getByText("error")).toBeInTheDocument();
  });

  it("should call contract read with provided arguments", async () => {
    const address = buildAddress();
    const func = buildAbiDefinedFunction({ inputs: buildInputList(2) });

    const { user } = renderView({ address, func });

    const firstInput = screen.getByLabelText(
      `${func.inputs[0].name} :: ${func.inputs[0].type}`
    );
    await user.type(firstInput, "first");

    const secondInput = screen.getByLabelText(
      `${func.inputs[1].name} :: ${func.inputs[1].type}`
    );
    await user.type(secondInput, "second");

    await waitFor(() => {
      expect(useContractReadMock).toHaveBeenCalledWith({
        abi: [func],
        address,
        args: ["first", "second"],
        functionName: func.name,
        watch: true,
      });
    });
  });
});
