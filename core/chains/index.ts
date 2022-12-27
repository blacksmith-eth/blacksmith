import { Chain, foundry, goerli, mainnet, sepolia } from "wagmi/chains";

const fork = (chain: Chain) => ({
  ...chain,
  name: `${chain.name} Fork`,
  rpcUrls: foundry.rpcUrls,
});

const forkedChains = [goerli, mainnet, sepolia].map(fork);

export { foundry, forkedChains };
