import { AbiDefinedFunction } from "core/types";
import Nonpayable from "./nonpayable";
import Payable from "./payable";
import Pure from "./pure";
import View from "./view";

const Function = ({ func }: { func: AbiDefinedFunction }) => {
  switch (func.stateMutability) {
    case "pure":
      return <Pure func={func} />;
    case "view":
      return <View func={func} />;
    case "nonpayable":
      return <Nonpayable func={func} />;
    case "payable":
      return <Payable func={func} />;
  }
};

export default Function;
