import { BlacksmithWalletProvider } from "packages/core/wallet";
import { BlacksmithConnector } from ".";

describe("BlacksmithConnector", () => {
  it("should be defined", () => {
    expect(BlacksmithConnector).toBeDefined();
  });

  it("should be instantiable", () => {
    const connector = new BlacksmithConnector();
    expect(connector).toBeInstanceOf(BlacksmithConnector);
  });

  it("should have a name", () => {
    const connector = new BlacksmithConnector();
    expect(connector.name).toBe("Blacksmith");
  });

  it("should have an id", () => {
    const connector = new BlacksmithConnector();
    expect(connector.id).toBe("blacksmith");
  });

  it("should use the provided provider", () => {
    const provider = new BlacksmithWalletProvider();
    const connector = new BlacksmithConnector({ provider });
    expect(connector.getProvider()).resolves.toBe(provider);
  });

  it("should have a ready state", () => {
    const connector = new BlacksmithConnector();
    expect(connector.ready).toBe(true);
  });

  it("#getProvider should return instance of BlacksmithWalletProvider", async () => {
    const connector = new BlacksmithConnector();
    const provider = await connector.getProvider();
    expect(provider).toBeInstanceOf(BlacksmithWalletProvider);
  });

  it("#getProvider should return the same instance of BlacksmithWalletProvider", async () => {
    const connector = new BlacksmithConnector();
    const provider1 = await connector.getProvider();
    const provider2 = await connector.getProvider();
    expect(provider1).toBe(provider2);
  });

  it.each([undefined, "0x0000000000000000000000000000000000000001"])(
    "#getAccount should return the account from the provider (%s)",
    async (address) => {
      const provider = new BlacksmithWalletProvider();
      provider.getAccount = vi.fn().mockResolvedValue(address);
      const connector = new BlacksmithConnector({ provider });
      const account = await connector.getAccount();
      expect(account).toBe(address);
    }
  );

  it.each([1, 2])("#getChainId should return the chainId (%i)", async (id) => {
    const provider = new BlacksmithWalletProvider();
    provider.getNetwork = vi.fn().mockResolvedValue({ chainId: id });
    const connector = new BlacksmithConnector({ provider });
    const chainId = await connector.getChainId();
    expect(chainId).toBe(id);
  });

  it("#getSigner should return the signer of the active account", async () => {
    const account = "0x0000000000000000000000000000000000000001";
    const provider = new BlacksmithWalletProvider();
    provider.getSigner = vi.fn().mockResolvedValue(account);
    const connector = new BlacksmithConnector({ provider });
    const signer = await connector.getSigner();
    expect(signer).toBe(account);
  });

  it("#isAuthorized should return true if getAccount is defined", async () => {
    const account = "0x0000000000000000000000000000000000000001";
    const provider = new BlacksmithWalletProvider();
    provider.getAccount = vi.fn().mockResolvedValue(account);
    const connector = new BlacksmithConnector({ provider });
    const authorized = await connector.isAuthorized();
    expect(authorized).toBe(true);
  });

  it("#isAuthorized should return false if getAccount is undefined", async () => {
    const provider = new BlacksmithWalletProvider();
    provider.getAccount = vi.fn().mockResolvedValue(undefined);
    const connector = new BlacksmithConnector({ provider });
    const authorized = await connector.isAuthorized();
    expect(authorized).toBe(false);
  });

  it("#isAuthorized should return false if getAccount throws", async () => {
    const provider = new BlacksmithWalletProvider();
    provider.listAccounts = vi.fn().mockRejectedValue(new Error("test"));
    const connector = new BlacksmithConnector({ provider });
    const authorized = await connector.isAuthorized();
    expect(authorized).toBe(false);
  });

  it("#connect should return the active account", async () => {
    const activeAccount = "0x0000000000000000000000000000000000000001";
    const provider = new BlacksmithWalletProvider();
    provider.getAccount = vi.fn().mockResolvedValue(activeAccount);
    provider.getNetwork = vi.fn().mockResolvedValue({ chainId: 1 });
    const connector = new BlacksmithConnector({ provider });
    const { account } = await connector.connect();
    expect(account).toBe(activeAccount);
  });

  it("#connect should return the chain", async () => {
    const provider = new BlacksmithWalletProvider();
    provider.getAccount = vi.fn().mockResolvedValue(undefined);
    provider.getNetwork = vi.fn().mockResolvedValue({ chainId: 1 });
    const connector = new BlacksmithConnector({ provider });
    const { chain } = await connector.connect();
    expect(chain).toEqual({ id: 1, unsupported: false });
  });

  it("#connect should return the provider", async () => {
    const injectedProvider = new BlacksmithWalletProvider();
    injectedProvider.getAccount = vi.fn().mockResolvedValue(undefined);
    injectedProvider.getNetwork = vi.fn().mockResolvedValue({ chainId: 1 });
    injectedProvider.getSigner = vi.fn();
    const connector = new BlacksmithConnector({ provider: injectedProvider });
    const { provider } = await connector.connect();
    expect(provider).toBe(injectedProvider);
  });

  it.each(["accountsChanged", "chainChanged", "disconnect"])(
    "#connect should subscribe to %s",
    async (event) => {
      const provider = new BlacksmithWalletProvider();
      provider.getAccount = vi.fn().mockResolvedValue(undefined);
      provider.getNetwork = vi.fn().mockResolvedValue({ chainId: 1 });
      provider.getSigner = vi.fn();
      provider.on = vi.fn();
      const connector = new BlacksmithConnector({ provider });
      await connector.connect();
      expect(provider.on).toHaveBeenCalledWith(event, expect.any(Function));
    }
  );

  it.each(["accountsChanged", "chainChanged", "disconnect"])(
    "#disconnect should unsubscribe from %s",
    async (event) => {
      const provider = new BlacksmithWalletProvider();
      provider.removeListener = vi.fn();
      const connector = new BlacksmithConnector({ provider });
      await connector.disconnect();
      expect(provider.removeListener).toHaveBeenCalledWith(
        event,
        expect.any(Function)
      );
    }
  );

  it("#listAccounts should return the accounts from the provider", async () => {
    const accounts = ["0x0000000000000000000000000000000000000001"];
    const provider = new BlacksmithWalletProvider();
    provider.listAccounts = vi.fn().mockResolvedValue(accounts);
    const connector = new BlacksmithConnector({ provider });
    const result = await connector.listAccounts();
    expect(result).toBe(accounts);
  });

  it("#changeAccount should call the provider changeAccount", async () => {
    const account = "0x0000000000000000000000000000000000000001";
    const provider = new BlacksmithWalletProvider();
    provider.changeAccount = vi.fn();
    const connector = new BlacksmithConnector({ provider });
    await connector.changeAccount(account);
    expect(provider.changeAccount).toHaveBeenCalledWith(account);
  });
});
