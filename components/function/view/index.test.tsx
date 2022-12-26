import { BigNumber } from "ethers";
import { ComponentProps } from "react";
import { render, screen, waitFor } from "testing";
import {
  buildAbiDefinedFunction,
  buildAddress,
  buildInput,
  buildInputList,
} from "testing/factory";
import type { Mock } from "vitest";
import { useContractRead } from "wagmi";
import { View } from ".";

vi.mock("wagmi");

const useContractReadMock = useContractRead as Mock;

useContractReadMock.mockReturnValue({
  data: undefined,
  isLoading: false,
  isError: false,
  refetch: vi.fn(),
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
      expect(screen.getByLabelText(input.name!)).toBeInTheDocument();
    });
  });

  it("should refetch on read button click", () => {
    const refetch = vi.fn();
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
      refetch: vi.fn(),
    });

    renderView();

    expect(screen.getByText(data)).toBeInTheDocument();
  });

  it("should render loading when isLoading is true", () => {
    useContractReadMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });

    renderView();

    expect(screen.getByText("loading...")).toBeInTheDocument();
  });

  it("should render error when isError is true", () => {
    useContractReadMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
    });

    renderView();

    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("should call contract read with provided arguments", async () => {
    const address = buildAddress();
    const func = buildAbiDefinedFunction({ inputs: buildInputList(2) });

    const { user } = renderView({ address, func });

    const firstInput = screen.getByLabelText(func.inputs[0].name!);
    await user.type(firstInput, "first");

    const secondInput = screen.getByLabelText(func.inputs[1].name!);
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

  it("should call contract read with formatted arguments", async () => {
    const address = buildAddress();
    const input1 = buildInput({ type: "uint256" });
    const input2 = buildInput({ type: "uint256" });
    const func = buildAbiDefinedFunction({ inputs: [input1, input2] });

    const { user } = renderView({ address, func });

    const firstInput = screen.getByLabelText(func.inputs[0].name!);
    await user.type(firstInput, "1");

    const secondInput = screen.getByLabelText(func.inputs[1].name!);
    await user.type(secondInput, "2");

    await waitFor(() => {
      expect(useContractReadMock).toHaveBeenCalledWith({
        abi: [func],
        address,
        args: [BigNumber.from("1"), BigNumber.from("2")],
        functionName: func.name,
        watch: true,
      });
    });
  });
});
