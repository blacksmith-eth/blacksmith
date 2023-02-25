import { BigNumber } from "ethers";
import { render, screen, waitFor } from "testing";
import {
  buildAbiDefinedNonpayableFunction,
  buildAddress,
  buildInput,
  buildInputList,
  buildTransactionHash,
} from "testing/factory";
import { PartialProps } from "testing/types";
import type { Mock } from "vitest";
import { useContractWrite } from "wagmi";
import { Nonpayable } from ".";

vi.mock("wagmi");

const useContractWriteMock = useContractWrite as Mock;
useContractWriteMock.mockReturnValue({ write: vi.fn() });

const renderNonpayable = (props: PartialProps<typeof Nonpayable> = {}) =>
  render(
    <Nonpayable
      address={props.address || buildAddress()}
      func={props.func || buildAbiDefinedNonpayableFunction()}
      initialCollapsed={props.initialCollapsed || false}
    />
  );

describe("Nonpayable", () => {
  it("should not render inputs when initialCollapsed is true", () => {
    const inputs = buildInputList(2);
    const func = buildAbiDefinedNonpayableFunction({ inputs });

    renderNonpayable({ func, initialCollapsed: true });

    func.inputs.forEach((input) => {
      expect(screen.queryByLabelText(input.name!)).not.toBeInTheDocument();
    });
  });

  it("should render function name", () => {
    const func = buildAbiDefinedNonpayableFunction();

    renderNonpayable({ func });

    expect(screen.getByText(`${func.name} → void`)).toBeInTheDocument();
  });

  it("should render function inputs", () => {
    const inputs = buildInputList(2);
    const func = buildAbiDefinedNonpayableFunction({ inputs });

    renderNonpayable({ func });

    func.inputs.forEach((input) => {
      expect(screen.getByLabelText(input.name!)).toBeInTheDocument();
    });
  });

  it("should call write function on write button click", () => {
    const writeMock = vi.fn();
    useContractWriteMock.mockReturnValue({ write: writeMock });

    renderNonpayable();

    screen.getByRole("button", { name: "write" }).click();

    expect(writeMock).toHaveBeenCalled();
  });

  it("should disable write button when write function is not available", () => {
    useContractWriteMock.mockReturnValue({ write: undefined });

    renderNonpayable();

    expect(screen.getByRole("button", { name: "write" })).toBeDisabled();
  });

  it("should disable write button when loading", () => {
    useContractWriteMock.mockReturnValue({ isLoading: true });

    renderNonpayable();

    expect(screen.getByRole("button", { name: "write" })).toBeDisabled();
  });

  it("should prepare contract write with provided arguments", async () => {
    const address = buildAddress();
    const func = buildAbiDefinedNonpayableFunction({
      inputs: buildInputList(2),
    });

    const { user } = renderNonpayable({ address, func });

    const firstInput = screen.getByLabelText(func.inputs[0].name!);
    await user.type(firstInput, "first");

    const secondInput = screen.getByLabelText(func.inputs[1].name!);
    await user.type(secondInput, "second");

    await waitFor(() => {
      expect(useContractWriteMock).toHaveBeenCalledWith({
        abi: [func],
        address,
        args: ["first", "second"],
        functionName: func.name,
        mode: "recklesslyUnprepared",
      });
    });
  });

  it("should prepare contract write with formatted arguments", async () => {
    const address = buildAddress();
    const input1 = buildInput({ type: "uint256" });
    const input2 = buildInput({ type: "uint256" });
    const func = buildAbiDefinedNonpayableFunction({
      inputs: [input1, input2],
    });

    const { user } = renderNonpayable({ address, func });

    const firstInput = screen.getByLabelText(func.inputs[0].name!);
    await user.type(firstInput, "1");

    const secondInput = screen.getByLabelText(func.inputs[1].name!);
    await user.type(secondInput, "2");

    await waitFor(() => {
      expect(useContractWriteMock).toHaveBeenCalledWith({
        abi: [func],
        address,
        args: [BigNumber.from("1"), BigNumber.from("2")],
        functionName: func.name,
        mode: "recklesslyUnprepared",
      });
    });
  });

  it("should render data hash when defined", () => {
    const hash = buildTransactionHash();
    useContractWriteMock.mockReturnValue({ data: { hash } });

    renderNonpayable();

    expect(screen.getByText(hash)).toBeInTheDocument();
  });
});
