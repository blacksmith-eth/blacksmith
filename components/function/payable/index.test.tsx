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
import Payable from ".";

jest.mock("wagmi");

const usePrepareContractWriteMock = usePrepareContractWrite as jest.Mock<any>;
usePrepareContractWriteMock.mockReturnValue({ config: {} });

const useContractWriteMock = useContractWrite as jest.Mock<any>;
useContractWriteMock.mockReturnValue({ write: jest.fn() });

const renderPayable = (props: Partial<ComponentProps<typeof Payable>> = {}) => {
  return render(
    <Payable
      address={props.address || buildAddress()}
      func={props.func || buildAbiDefinedFunction()}
    />
  );
};

describe("Payable", () => {
  beforeEach(jest.clearAllMocks);

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
      expect(
        screen.getByLabelText(`${input.name} :: ${input.type}`)
      ).toBeInTheDocument();
    });
  });

  it("should call write function on send button click", () => {
    const writeMock = jest.fn();
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
    useContractWriteMock.mockReturnValue({ write: jest.fn(), isLoading: true });

    renderPayable();

    expect(screen.getByRole("button", { name: "send" })).toBeDisabled();
  });

  it("should prepare contract write with provided arguments", async () => {
    const address = buildAddress();
    const func = buildAbiDefinedFunction({ inputs: buildInputList(2) });

    const { user } = renderPayable({ address, func });

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

  it("should prepare contract write with formmated arguments", async () => {
    const address = buildAddress();
    const input1 = buildInput({ type: "uint256" });
    const input2 = buildInput({ type: "uint256" });
    const func = buildAbiDefinedFunction({ inputs: [input1, input2] });

    const { user } = renderPayable({ address, func });

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
