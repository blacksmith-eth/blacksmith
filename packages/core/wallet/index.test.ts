import { BlacksmithWalletProvider } from ".";

describe("BlacksmithWalletProvider", () => {
  it("should be defined", () => {
    expect(BlacksmithWalletProvider).toBeDefined();
  });

  it("should be instantiable", () => {
    const provider = new BlacksmithWalletProvider();
    expect(provider).toBeInstanceOf(BlacksmithWalletProvider);
  });

  it("#changeAccount should change the account index", async () => {
    const accounts = [
      "0x0000000000000000000000000000000000000001",
      "0x0000000000000000000000000000000000000002",
    ];
    const provider = new BlacksmithWalletProvider();
    provider.listAccounts = vi.fn().mockResolvedValue(accounts);
    provider.changeAccount(1);
    const account = await provider.getAccount();
    expect(account).toBe(accounts[1]);
  });

  it("#changeAccount should change the account index by address", async () => {
    const accounts = [
      "0x0000000000000000000000000000000000000001",
      "0x0000000000000000000000000000000000000002",
    ];
    const provider = new BlacksmithWalletProvider();
    provider.listAccounts = vi.fn().mockResolvedValue(accounts);
    provider.changeAccount(accounts[2]);
    const account = await provider.getAccount();
    expect(account).toBe(accounts[2]);
  });

  it("#changeAccount should emit accountsChanged", async () => {
    const accounts = [
      "0x0000000000000000000000000000000000000001",
      "0x0000000000000000000000000000000000000002",
    ];
    const provider = new BlacksmithWalletProvider();
    provider.listAccounts = vi.fn().mockResolvedValue(accounts);
    provider.emit = vi.fn();
    await provider.changeAccount(1);
    expect(provider.emit).toHaveBeenCalledWith("accountsChanged", [
      accounts[1],
    ]);
  });

  it("#getSigner should return a signer", () => {
    const provider = new BlacksmithWalletProvider();
    const signer = provider.getSigner();
    expect(signer).toBeDefined();
  });
});
