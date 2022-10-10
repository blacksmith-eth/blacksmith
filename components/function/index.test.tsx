import { AbiStateMutability } from "core/types";
import { render, screen } from "testing";
import { buildAbiDefinedFunction } from "testing/factory";
import Function from ".";

describe("Function", () => {
  it.each(["pure", "view", "nonpayable", "payable"] as AbiStateMutability[])(
    "should render a %s function",
    (stateMutability) => {
      const func = buildAbiDefinedFunction({
        stateMutability,
      });

      render(<Function func={func} />);

      expect(
        screen.getByText(stateMutability, { exact: false })
      ).toBeInTheDocument();
    }
  );
});
