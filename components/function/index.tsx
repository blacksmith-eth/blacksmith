import { AbiDefinedStateFunction, Address } from "core/types";
import { Nonpayable } from "./nonpayable";
import { Payable } from "./payable";
import { Pure } from "./pure";
import { View } from "./view";

type FuncProps = {
  address: Address;
  func: AbiDefinedStateFunction;
};

export const Func = ({ address, func }: FuncProps) => {
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
