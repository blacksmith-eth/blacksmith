import { render, screen } from "testing";
import { buildAddress } from "testing/factory";
import { PartialProps } from "testing/types";
import { Mock } from "vitest";
import {
  useAccount,
  useBalance,
  usePrepareSendTransaction,
  useSendTransaction,
} from "wagmi";
import { Wallet } from ".";

vi.mock("wagmi");

const usePrepareSendTransactionMock = usePrepareSendTransaction as Mock;

usePrepareSendTransactionMock.mockReturnValue({
  config: {},
});

const useSendTransactionMock = useSendTransaction as Mock;

useSendTransactionMock.mockReturnValue({
  sendTransaction: vi.fn(),
});

const useAccountMock = useAccount as Mock;

useAccountMock.mockReturnValue({
  address: buildAddress(),
});

const useBalanceMock = useBalance as Mock;

useBalanceMock.mockReturnValue({
  data: undefined,
});

const renderWallet = (props: PartialProps<typeof Wallet> = {}) =>
  render(<Wallet open={props.open || false} />);

describe("Wallet", () => {
  it("should render nothing if open is false", () => {
    renderWallet({ open: false });

    expect(screen.queryByText("wallet")).not.toBeInTheDocument();
  });

  it("should render transfer if open is true", () => {
    renderWallet({ open: true });

    expect(
      screen.getByRole("heading", { level: 2, name: "Transfer" })
    ).toBeInTheDocument();
  });

  it("should render the change account if open is true", () => {
    renderWallet({ open: true });

    expect(
      screen.getByRole("heading", { level: 2, name: "Change Account" })
    ).toBeInTheDocument();
  });
});
