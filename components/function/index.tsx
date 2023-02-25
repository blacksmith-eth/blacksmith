import { AbiDefinedStateFunction, Address } from "core/types";
import { Nonpayable } from "./nonpayable";
import { Payable } from "./payable";
import { Pure } from "./pure";
import { View } from "./view";

type FunctionProps = {
  address: Address;
  func: AbiDefinedStateFunction;
};

export const Function = ({ address, func }: FunctionProps) => {
  switch (func.stateMutability) {
    case "pure":
      return <Pure address={address} func={func} initialCollapsed={true} />;
    case "view":
      return <View address={address} func={func} initialCollapsed={true} />;
    case "nonpayable":
      return (
        <Nonpayable address={address} func={func} initialCollapsed={true} />
      );
    case "payable":
      return <Payable address={address} func={func} initialCollapsed={true} />;
    default:
      return <></>;
  }
};
