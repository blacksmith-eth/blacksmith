import { ComponentProps } from "react";
import { render, screen } from "testing";
import {
  buildAbiDefinedFunction,
  buildAddress,
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
});
