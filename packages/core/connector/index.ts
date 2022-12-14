import { Connector, Chain, Address } from "wagmi";
import {
  BlacksmithWalletOptions,
  BlacksmithWalletProvider,
  BlacksmithSigner,
} from "packages/core/wallet";

export class BlacksmithConnector extends Connector<
  BlacksmithWalletProvider,
  BlacksmithWalletOptions,
  BlacksmithSigner
> {
  readonly id = "blacksmith";
  readonly name = "Blacksmith";
  readonly ready = true;

  #provider: BlacksmithWalletProvider;

  constructor({
    chains,
    options,
    provider,
  }: {
    chains?: Chain[];
    options?: BlacksmithWalletOptions;
    provider?: BlacksmithWalletProvider;
  } = {}) {
    super({ chains, options });
    this.#provider = provider || new BlacksmithWalletProvider(options);
  }

  async connect() {
    const provider = await this.getProvider();
    const account = await this.getAccount();
    const chainId = await this.getChainId();

    if (provider.on) {
      provider.on("accountsChanged", this.onAccountsChanged);
      provider.on("chainChanged", this.onChainChanged);
      provider.on("disconnect", this.onDisconnect);
    }

    return {
      account,
      chain: { id: chainId, unsupported: false },
      provider,
    };
  }

  async disconnect() {
    const provider = await this.getProvider();

    provider.removeListener("accountsChanged", this.onAccountsChanged);
    provider.removeListener("chainChanged", this.onChainChanged);
    provider.removeListener("disconnect", this.onDisconnect);
  }

  async getAccount(): Promise<Address> {
    const provider = await this.getProvider();
    const account = await provider.getAccount();
    return account;
  }

  async getChainId() {
    const provider = await this.getProvider();
    const network = await provider.getNetwork();
    return network.chainId;
  }

  async getProvider() {
    return this.#provider;
  }

  async getSigner() {
    const provider = await this.getProvider();
    return provider.getSigner();
  }

  async isAuthorized() {
    try {
      const account = await this.getAccount();
      return !!account;
    } catch {
      return false;
    }
  }

  async changeAccount(indexOrAddress: number | string) {
    const provider = await this.getProvider();
    await provider.changeAccount(indexOrAddress);
  }

  async listAccounts() {
    const provider = await this.getProvider();
    return provider.listAccounts() as Promise<Address[]>;
  }

  protected onAccountsChanged = (accounts: Address[]) => {
    this.emit("change", { account: accounts[0] });
  };

  protected onChainChanged = () => {};

  protected onDisconnect = () => {
    this.emit("disconnect");
  };
}
