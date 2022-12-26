import { AbiDefinedFunction, Address } from "core/types";
import { Nonpayable } from "./nonpayable";
import { Payable } from "./payable";
import { Pure } from "./pure";
import { View } from "./view";

type FunctionProps = {
  address: Address;
  func: AbiDefinedFunction;
};

export const Function = ({ address, func }: FunctionProps) => {
  switch (func.stateMutability) {
    case "pure":
      return <Pure address={address} func={func} />;
    case "view":
      return <View address={address} func={func} />;
    case "nonpayable":
      return <Nonpayable address={address} func={func} />;
    case "payable":
      return <Payable address={address} func={func} />;
  }
};
