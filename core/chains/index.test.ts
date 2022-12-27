import { forkedChains, foundry } from ".";

describe("chains", () => {
  it("should not append 'Fork' to foundry chain", () => {
    expect(foundry.name).toBe("Foundry");
  });

  it.each(forkedChains)(
    "should append 'Fork' to the name of the chain",
    (forkedChain) => {
      expect(forkedChain.name.endsWith(" Fork")).toBe(true);
    }
  );

  it.each(forkedChains)("should use foundry rpcUrls", (forkedChain) => {
    expect(forkedChain.rpcUrls).toEqual(foundry.rpcUrls);
  });
});
