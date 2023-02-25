import { BigNumber } from "ethers";
import { render, screen, waitFor } from "testing";
import {
  buildAbiDefinedViewFunction,
  buildAddress,
  buildInput,
  buildInputList,
} from "testing/factory";
import { PartialProps } from "testing/types";
import type { Mock } from "vitest";
import { useContractRead } from "wagmi";
import { View } from ".";

vi.mock("wagmi");

const useContractReadMock = useContractRead as Mock;

useContractReadMock.mockReturnValue({
  data: undefined,
  isError: false,
  isLoading: false,
  refetch: vi.fn(),
});

const renderView = (props: PartialProps<typeof View> = {}) =>
  render(
    <View
      address={props.address || buildAddress()}
      func={props.func || buildAbiDefinedViewFunction()}
      initialCollapsed={props.initialCollapsed || false}
    />
  );

describe("View", () => {
  it("should not render inputs when initialCollapsed is true", () => {
    const inputs = buildInputList(2);
    const func = buildAbiDefinedViewFunction({ inputs });

    renderView({ func, initialCollapsed: true });

    func.inputs.forEach((input) => {
      expect(screen.queryByLabelText(input.name!)).not.toBeInTheDocument();
    });
  });

  it("should render function name", () => {
    const func = buildAbiDefinedViewFunction();

    renderView({ func });

    expect(screen.getByText(`${func.name} → void`)).toBeInTheDocument();
  });

  it("should render function inputs", () => {
    const inputs = buildInputList(2);
    const func = buildAbiDefinedViewFunction({ inputs });

    renderView({ func });

    func.inputs.forEach((input) => {
      expect(screen.getByLabelText(input.name!)).toBeInTheDocument();
    });
  });

  it("should refetch on read button click", () => {
    const refetch = vi.fn();
    useContractReadMock.mockReturnValue({
      data: undefined,
      isError: false,
      isLoading: false,
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
      isError: false,
      isLoading: false,
      refetch: vi.fn(),
    });

    renderView();

    expect(screen.getByText(data)).toBeInTheDocument();
  });

  it("should render loading when isLoading is true", () => {
    useContractReadMock.mockReturnValue({
      data: undefined,
      isError: false,
      isLoading: true,
      refetch: vi.fn(),
    });

    renderView();

    expect(screen.getByText("loading...")).toBeInTheDocument();
  });

  it("should render error when isError is true", () => {
    useContractReadMock.mockReturnValue({
      data: undefined,
      isError: true,
      isLoading: false,
      refetch: vi.fn(),
    });

    renderView();

    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("should call contract read with provided arguments", async () => {
    const address = buildAddress();
    const func = buildAbiDefinedViewFunction({ inputs: buildInputList(2) });

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
    const func = buildAbiDefinedViewFunction({ inputs: [input1, input2] });

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
