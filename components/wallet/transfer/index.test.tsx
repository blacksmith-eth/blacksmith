import { faker } from "@faker-js/faker/locale/en";
import { render, screen } from "testing";
import { buildAddress } from "testing/factory";
import { usePrepareSendTransaction, useSendTransaction } from "wagmi";
import { Transfer } from ".";

vi.mock("wagmi");

const usePrepareSendTransactionMock =
  usePrepareSendTransaction as jest.Mock<any>;

usePrepareSendTransactionMock.mockReturnValue({
  config: {},
});

const useSendTransactionMock = useSendTransaction as jest.Mock<any>;

useSendTransactionMock.mockReturnValue({
  sendTransaction: vi.fn(),
});

const renderTransfer = () => {
  return render(<Transfer />);
};

describe("Transfer", () => {
  it("should allow user to transfer", async () => {
    const sendTransactionMock = vi.fn();
    useSendTransactionMock.mockReturnValue({
      sendTransaction: sendTransactionMock,
    });

    const { user } = renderTransfer();

    const transferButton = screen.getByRole("button", { name: "send" });

    await user.click(transferButton);

    expect(sendTransactionMock).toHaveBeenCalled();
  });

  it("should allow user to change recipient", async () => {
    const address = buildAddress();
    const { user } = renderTransfer();

    const recipientInput = screen.getByLabelText("recipient");

    await user.type(recipientInput, address);

    expect(recipientInput).toHaveValue(address);
  });

  it("should allow user to change value", async () => {
    const value = faker.random.numeric(3);
    const { user } = renderTransfer();

    const valueInput = screen.getByLabelText("value");

    await user.type(valueInput, value);

    expect(valueInput).toHaveValue(value);
  });

  it("should render a disabled transfer button if sendTransaction is undefined", async () => {
    useSendTransactionMock.mockReturnValue({
      sendTransaction: undefined,
    });

    renderTransfer();

    const transferButton = screen.getByRole("button", { name: "send" });

    expect(transferButton).toBeDisabled();
  });
});
