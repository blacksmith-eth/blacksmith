import { render, screen } from "testing";
import { buildAddress } from "testing/factory";
import { Setup } from ".";

describe("Setup", () => {
  it("renders the default command", () => {
    render(<Setup />);

    expect(
      screen.getByText("forge create", { exact: false })
    ).toBeInTheDocument();
  });

  it("renders the specified command path", async () => {
    const path = "path/to/contract";
    const { user } = render(<Setup />);

    await user.type(screen.getByLabelText("path"), path);

    expect(screen.getByText(path, { exact: false })).toBeInTheDocument();
  });

  it("renders the specified command contract name", async () => {
    const contractName = "ContractName";
    const { user } = render(<Setup />);

    await user.type(screen.getByLabelText("contract name"), contractName);

    expect(
      screen.getByText(contractName, { exact: false })
    ).toBeInTheDocument();
  });

  it("renders the specified command deployer address", async () => {
    const address = buildAddress();
    const { user } = render(<Setup />);

    await user.type(screen.getByLabelText("deployer address"), address);

    expect(screen.getByText(address, { exact: false })).toBeInTheDocument();
  });

  it("render the specified rpc url", async () => {
    const rpcUrl = "http://rpc.url";
    const { user } = render(<Setup />);

    await user.type(screen.getByLabelText("rpc url"), rpcUrl);

    expect(screen.getByText(rpcUrl, { exact: false })).toBeInTheDocument();
  });

  it("render the specified verifier url", async () => {
    const verifierUrl = "http://verifier.url";
    const { user } = render(<Setup />);

    await user.type(screen.getByLabelText("verifier url"), verifierUrl);

    expect(screen.getByText(verifierUrl, { exact: false })).toBeInTheDocument();
  });

  it("renders a button to copy the command", async () => {
    const { user } = render(<Setup />);

    const copyButton = screen.getByRole("button", { name: "Copy Command" });

    await user.click(copyButton);

    const copiedText = await navigator.clipboard.readText();
    expect(copiedText).toEqual(
      "forge create src/Counter.sol:Counter --verify --unlocked --from 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 --rpc-url http://localhost:8545 --verifier-url http://localhost:3000/api/verify --etherscan-api-key blacksmith"
    );
  });
});
