import { utils } from "ethers";
import { Address } from "core/types";

const getAddress = (address: Address) => {
  try {
    return utils.getAddress(address);
  } catch {
    return null;
  }
};

export { getAddress };
