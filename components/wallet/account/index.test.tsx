import { render, screen } from "testing";
import { buildAddress } from "testing/factory";
import { Mock } from "vitest";
import { useAccount, useBalance } from "wagmi";
import { Account } from ".";

vi.mock("wagmi");

const useAccountMock = useAccount as Mock;

useAccountMock.mockReturnValue({
  address: buildAddress(),
});

const useBalanceMock = useBalance as Mock;

useBalanceMock.mockReturnValue({ data: undefined });

const renderAccount = () => render(<Account />);

describe("Account", () => {
  it("should render the truncated account address", () => {
    const address = buildAddress();
    useAccountMock.mockReturnValue({
      address,
    });

    renderAccount();

    expect(
      screen.getByRole("button", {
        name: `account ${address.slice(0, 6)}...${address.slice(-4)}`,
      })
    ).toBeInTheDocument();
  });

  it("should render the truncated account address with balance", () => {
    const address = buildAddress();
    useAccountMock.mockReturnValue({
      address,
    });

    useBalanceMock.mockReturnValue({
      data: {
        formatted: "100.99",
        symbol: "ETH",
      },
    });

    renderAccount();

    expect(
      screen.getByRole("button", {
        name: `account ${address.slice(0, 6)}...${address.slice(
          -4
        )} | 100.9 ETH`,
      })
    ).toBeInTheDocument();
  });
});
