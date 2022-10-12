import { ComponentProps } from "react";
import { render, screen } from "testing";
import {
  buildAbiDefinedFunction,
  buildAddress,
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

describe("Nonpayable", () => {
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
});
