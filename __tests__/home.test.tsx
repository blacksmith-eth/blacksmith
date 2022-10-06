import { render, screen } from "testing";
import Home from "pages/index";

describe("Home", () => {
  it("should render without crashing", () => {
    render(<Home />);
  });

  it("should have a heading", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "blacksmith",
    });

    expect(heading).toBeInTheDocument();
  });

  it("should open and close the wallet", async () => {
    const { user } = render(<Home />);

    const openWalletButton = screen.getByRole("button", {
      name: "open wallet",
    });

    expect(openWalletButton).toBeInTheDocument();

    await user.click(openWalletButton);

    expect(
      screen.getByRole("heading", { level: 2, name: "wallet" })
    ).toBeInTheDocument();

    const closeWalletButton = screen.getByRole("button", {
      name: "close wallet",
    });

    expect(closeWalletButton).toBeInTheDocument();

    await user.click(closeWalletButton);

    expect(
      screen.queryByRole("heading", { level: 2, name: "wallet" })
    ).not.toBeInTheDocument();
  });

  it("should open and close the drawer", async () => {
    const { user } = render(<Home />);

    const openDrawerButton = screen.getByRole("button", {
      name: "open drawer",
    });

    expect(openDrawerButton).toBeInTheDocument();

    await user.click(openDrawerButton);

    expect(
      screen.getByRole("heading", { level: 2, name: "drawer" })
    ).toBeInTheDocument();

    const closeDrawerButton = screen.getByRole("button", {
      name: "close drawer",
    });

    expect(closeDrawerButton).toBeInTheDocument();

    await user.click(closeDrawerButton);

    expect(
      screen.queryByRole("heading", { level: 2, name: "drawer" })
    ).not.toBeInTheDocument();
  });
});
