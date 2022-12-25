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
});
