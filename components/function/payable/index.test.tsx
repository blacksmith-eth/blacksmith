import { BigNumber } from "ethers";
import { ComponentProps } from "react";
import { render, screen, waitFor } from "testing";
import {
  buildAbiDefinedFunction,
  buildAddress,
  buildInput,
  buildInputList,
  buildTransactionHash,
} from "testing/factory";
import type { Mock } from "vitest";
import { useContractWrite } from "wagmi";
import { Payable } from ".";

vi.mock("wagmi");

const useContractWriteMock = useContractWrite as Mock;
useContractWriteMock.mockReturnValue({ write: vi.fn() });

const renderPayable = (props: Partial<ComponentProps<typeof Payable>> = {}) => {
  return render(
    <Payable
      address={props.address || buildAddress()}
      func={props.func || buildAbiDefinedFunction()}
    />
  );
};

describe("Payable", () => {
  it("should render function name", () => {
    const func = buildAbiDefinedFunction();

    renderPayable({ func });

    expect(screen.getByText(func.name, { exact: false })).toBeInTheDocument();
  });

  it("should render function inputs", () => {
    const inputs = buildInputList(2);
    const func = buildAbiDefinedFunction({ inputs });

    renderPayable({ func });

    func.inputs.forEach((input) => {
      expect(screen.getByLabelText(input.name!)).toBeInTheDocument();
    });
  });

  it("should call write function on send button click", () => {
    const writeMock = vi.fn();
    useContractWriteMock.mockReturnValue({ write: writeMock });

    renderPayable();

    screen.getByRole("button", { name: "send" }).click();

    expect(writeMock).toHaveBeenCalled();
  });

  it("should disable send button when write function is not available", () => {
    useContractWriteMock.mockReturnValue({ write: undefined });

    renderPayable();

    expect(screen.getByRole("button", { name: "send" })).toBeDisabled();
  });

  it("should disable send button when loading", () => {
    useContractWriteMock.mockReturnValue({ write: vi.fn(), isLoading: true });

    renderPayable();

    expect(screen.getByRole("button", { name: "send" })).toBeDisabled();
  });

  it("should prepare contract write with provided arguments", async () => {
    const address = buildAddress();
    const func = buildAbiDefinedFunction({ inputs: buildInputList(2) });

    const { user } = renderPayable({ address, func });

    const firstInput = screen.getByLabelText(func.inputs[0].name!);
    await user.type(firstInput, "first");

    const secondInput = screen.getByLabelText(func.inputs[1].name!);
    await user.type(secondInput, "second");

    await waitFor(() => {
      expect(useContractWriteMock).toHaveBeenCalledWith({
        mode: "recklesslyUnprepared",
        abi: [func],
        address,
        args: ["first", "second"],
        functionName: func.name,
        overrides: {
          value: BigNumber.from(0),
        },
      });
    });
  });

  it("should prepare contract write with formatted arguments", async () => {
    const address = buildAddress();
    const input1 = buildInput({ type: "uint256" });
    const input2 = buildInput({ type: "uint256" });
    const func = buildAbiDefinedFunction({ inputs: [input1, input2] });

    const { user } = renderPayable({ address, func });

    const valueInput = screen.getByLabelText("value");
    await user.type(valueInput, "1");

    const firstInput = screen.getByLabelText(func.inputs[0].name!);
    await user.type(firstInput, "1");

    const secondInput = screen.getByLabelText(func.inputs[1].name!);
    await user.type(secondInput, "2");

    await waitFor(() => {
      expect(useContractWriteMock).toHaveBeenCalledWith({
        mode: "recklesslyUnprepared",
        abi: [func],
        address,
        args: [BigNumber.from("1"), BigNumber.from("2")],
        functionName: func.name,
        overrides: {
          value: BigNumber.from("1"),
        },
      });
    });
  });

  it("should prepare contract with formatted value based on the selected unit", async () => {
    const address = buildAddress();
    const func = buildAbiDefinedFunction();

    const { user } = renderPayable({ address, func });

    const valueInput = screen.getByLabelText("value");
    await user.type(valueInput, "1");

    const unitSelect = screen.getByLabelText("unit");
    await user.click(unitSelect);

    const listbox = screen.getByRole("listbox");
    await user.selectOptions(listbox, "ether");

    await waitFor(() => {
      expect(useContractWriteMock).toHaveBeenCalledWith({
        mode: "recklesslyUnprepared",
        abi: [func],
        address,
        args: [],
        functionName: func.name,
        overrides: {
          value: BigNumber.from("1000000000000000000"),
        },
      });
    });
  });

  it("should render data hash when defined", () => {
    const hash = buildTransactionHash();

    useContractWriteMock.mockReturnValue({ data: { hash } });

    renderPayable();

    expect(screen.getByText(hash)).toBeInTheDocument();
  });
});
