import { providers } from "ethers";
import { Address } from "wagmi";

export type BlacksmithWalletOptions =
  | ConstructorParameters<typeof providers.JsonRpcProvider>
  | undefined;

export type BlacksmithSigner = providers.JsonRpcSigner;

export class BlacksmithWalletProvider extends providers.JsonRpcProvider {
  #accountIndex = 0;

  constructor(options: BlacksmithWalletOptions = []) {
    super(options[0], options[1]);
  }

  async getAccount(): Promise<Address> {
    const accounts = (await this.listAccounts()) as Address[];
    return accounts[this.#accountIndex];
  }

  getSigner() {
    return super.getSigner(this.#accountIndex);
  }

  async changeAccount(indexOrAddress: number | string) {
    const accounts = await this.listAccounts();
    const index =
      typeof indexOrAddress === "number"
        ? indexOrAddress
        : accounts.indexOf(indexOrAddress);
    this.#accountIndex = index;
    this.emit("accountsChanged", [accounts[index]]);
  }
}
