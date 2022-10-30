import { BigNumber } from "ethers";
import { ComponentProps } from "react";
import { render, screen, waitFor } from "testing";
import {
  buildAbiDefinedFunction,
  buildAddress,
  buildInput,
  buildInputList,
} from "testing/factory";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import Nonpayable from ".";

jest.mock("wagmi");

const usePrepareContractWriteMock = usePrepareContractWrite as jest.Mock<any>;
usePrepareContractWriteMock.mockReturnValue({ config: {} });

const useContractWriteMock = useContractWrite as jest.Mock<any>;
useContractWriteMock.mockReturnValue({ write: jest.fn() });

const renderNonpayable = (
  props: Partial<ComponentProps<typeof Nonpayable>> = {}
) => {
  return render(
    <Nonpayable
      address={props.address || buildAddress()}
      func={props.func || buildAbiDefinedFunction()}
    />
  );
};

describe("Nonpayable", () => {
  beforeEach(jest.clearAllMocks);

  it("should render function name", () => {
    const func = buildAbiDefinedFunction();

    renderNonpayable({ func });

    expect(screen.getByText(func.name, { exact: false })).toBeInTheDocument();
  });

  it("should render function inputs", () => {
    const inputs = buildInputList(2);
    const func = buildAbiDefinedFunction({ inputs });

    renderNonpayable({ func });

    func.inputs.forEach((input) => {
      expect(
        screen.getByLabelText(`${input.name} :: ${input.type}`)
      ).toBeInTheDocument();
    });
  });

  it("should call write function on write button click", () => {
    const writeMock = jest.fn();
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
    const func = buildAbiDefinedFunction({ inputs: buildInputList(2) });

    const { user } = renderNonpayable({ address, func });

    const firstInput = screen.getByLabelText(
      `${func.inputs[0].name} :: ${func.inputs[0].type}`
    );
    await user.type(firstInput, "first");

    const secondInput = screen.getByLabelText(
      `${func.inputs[1].name} :: ${func.inputs[1].type}`
    );
    await user.type(secondInput, "second");

    await waitFor(() => {
      expect(usePrepareContractWriteMock).toHaveBeenCalledWith({
        abi: [func],
        address,
        args: ["first", "second"],
        functionName: func.name,
      });
    });
  });

  it("should prepare contract write with formatted arguments", async () => {
    const address = buildAddress();
    const input1 = buildInput({ type: "uint256" });
    const input2 = buildInput({ type: "uint256" });
    const func = buildAbiDefinedFunction({ inputs: [input1, input2] });

    const { user } = renderNonpayable({ address, func });

    const firstInput = screen.getByLabelText(
      `${func.inputs[0].name} :: ${func.inputs[0].type}`
    );
    await user.type(firstInput, "1");

    const secondInput = screen.getByLabelText(
      `${func.inputs[1].name} :: ${func.inputs[1].type}`
    );
    await user.type(secondInput, "2");

    await waitFor(() => {
      expect(usePrepareContractWriteMock).toHaveBeenCalledWith({
        abi: [func],
        address,
        args: [BigNumber.from("1"), BigNumber.from("2")],
        functionName: func.name,
      });
    });
  });
});
