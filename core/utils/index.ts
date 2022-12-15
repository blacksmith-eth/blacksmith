import { ethers } from "ethers";
import { Address } from "core/types";

const getAddress = (address: Address) => {
  try {
    return ethers.utils.getAddress(address);
  } catch {
    return null;
  }
};

export { getAddress };
