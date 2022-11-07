import { faker } from "@faker-js/faker";
import { ComponentProps } from "react";
import { render, screen } from "testing";
import { buildAddress } from "testing/factory";
import {
  useAccount,
  useBalance,
  usePrepareSendTransaction,
  useSendTransaction,
} from "wagmi";
import Wallet from ".";

jest.mock("wagmi");

const usePrepareSendTransactionMock =
  usePrepareSendTransaction as jest.Mock<any>;

usePrepareSendTransactionMock.mockReturnValue({
  config: {},
});

const useSendTransactionMock = useSendTransaction as jest.Mock<any>;

useSendTransactionMock.mockReturnValue({
  sendTransaction: jest.fn(),
});

const useAccountMock = useAccount as jest.Mock<any>;

useAccountMock.mockReturnValue({
  address: buildAddress(),
});

const useBalanceMock = useBalance as jest.Mock<any>;

useBalanceMock.mockReturnValue({
  data: undefined,
});

const renderWallet = (props: Partial<ComponentProps<typeof Wallet>> = {}) => {
  return render(<Wallet open={props.open || false} />);
};

describe("Wallet", () => {
  it("should render nothing if open is false", () => {
    renderWallet({ open: false });

    expect(screen.queryByText("wallet")).not.toBeInTheDocument();
  });

  it("should render transfer if open is true", () => {
    renderWallet({ open: true });

    expect(screen.getByText("Transfer")).toBeInTheDocument();
  });

  it("should allow user to transfer", async () => {
    const sendTransactionMock = jest.fn();
    useSendTransactionMock.mockReturnValue({
      sendTransaction: sendTransactionMock,
    });

    const { user } = renderWallet({ open: true });

    const transferButton = screen.getByRole("button", { name: "send" });

    await user.click(transferButton);

    expect(sendTransactionMock).toHaveBeenCalled();
  });

  it("should allow user to change recipient", async () => {
    const address = buildAddress();
    const { user } = renderWallet({ open: true });

    const recipientInput = screen.getByLabelText("recipient");

    await user.type(recipientInput, address);

    expect(recipientInput).toHaveValue(address);
  });

  it("should allow user to change value", async () => {
    const value = faker.random.numeric(3);
    const { user } = renderWallet({ open: true });

    const valueInput = screen.getByLabelText("value");

    await user.type(valueInput, value);

    expect(valueInput).toHaveValue(value);
  });

  it("should render a disabled transfer button if sendTransaction is undefined", async () => {
    useSendTransactionMock.mockReturnValue({
      sendTransaction: undefined,
    });

    renderWallet({ open: true });

    const transferButton = screen.getByRole("button", { name: "send" });

    expect(transferButton).toBeDisabled();
  });

  it("should render the change account section", () => {
    renderWallet({ open: true });

    expect(
      screen.getByRole("heading", { name: "Change Account" })
    ).toBeInTheDocument();
  });
});
