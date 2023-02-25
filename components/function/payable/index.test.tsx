import { BigNumber } from "ethers";
import { render, screen, waitFor } from "testing";
import {
  buildAbiDefinedPayableFunction,
  buildAddress,
  buildInput,
  buildInputList,
  buildTransactionHash,
} from "testing/factory";
import { PartialProps } from "testing/types";
import type { Mock } from "vitest";
import { useContractWrite } from "wagmi";
import { Payable } from ".";

vi.mock("wagmi");

const useContractWriteMock = useContractWrite as Mock;
useContractWriteMock.mockReturnValue({ write: vi.fn() });

const renderPayable = (props: PartialProps<typeof Payable> = {}) =>
  render(
    <Payable
      address={props.address || buildAddress()}
      func={props.func || buildAbiDefinedPayableFunction()}
      initialCollapsed={props.initialCollapsed || false}
    />
  );

describe("Payable", () => {
  it("should not render inputs when initialCollapsed is true", () => {
    const inputs = buildInputList(2);
    const func = buildAbiDefinedPayableFunction({ inputs });

    renderPayable({ func, initialCollapsed: true });

    func.inputs.forEach((input) => {
      expect(screen.queryByLabelText(input.name!)).not.toBeInTheDocument();
    });
  });

  it("should render function name", () => {
    const func = buildAbiDefinedPayableFunction();

    renderPayable({ func });

    expect(screen.getByText(`${func.name} → void`)).toBeInTheDocument();
  });

  it("should render function inputs", () => {
    const inputs = buildInputList(2);
    const func = buildAbiDefinedPayableFunction({ inputs });

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
    useContractWriteMock.mockReturnValue({ isLoading: true, write: vi.fn() });

    renderPayable();

    expect(screen.getByRole("button", { name: "send" })).toBeDisabled();
  });

  it("should prepare contract write with provided arguments", async () => {
    const address = buildAddress();
    const func = buildAbiDefinedPayableFunction({ inputs: buildInputList(2) });

    const { user } = renderPayable({ address, func });

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
    const func = buildAbiDefinedPayableFunction({ inputs: [input1, input2] });

    const { user } = renderPayable({ address, func });

    const valueInput = screen.getByLabelText("value");
    await user.type(valueInput, "1");

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
        overrides: {
          value: BigNumber.from("1"),
        },
      });
    });
  });

  it("should prepare contract with formatted value based on the selected unit", async () => {
    const address = buildAddress();
    const func = buildAbiDefinedPayableFunction();

    const { user } = renderPayable({ address, func });

    const valueInput = screen.getByLabelText("value");
    await user.type(valueInput, "1");

    const unitSelect = screen.getByLabelText("unit");
    await user.click(unitSelect);

    const listbox = screen.getByRole("listbox");
    await user.selectOptions(listbox, "ether");

    await waitFor(() => {
      expect(useContractWriteMock).toHaveBeenCalledWith({
        abi: [func],
        address,
        args: [],
        functionName: func.name,
        mode: "recklesslyUnprepared",
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
