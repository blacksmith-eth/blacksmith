import { ComponentProps } from "react";
import { render, screen, waitFor } from "testing";
import { buildInputList } from "testing/factory";
import Inputs from ".";

const renderInputs = (props: Partial<ComponentProps<typeof Inputs>>) => {
  return render(
    <Inputs
      name={props.name || ""}
      inputs={props.inputs || []}
      args={props.args || []}
      updateArg={props.updateArg || jest.fn()}
    />
  );
};

describe("Inputs", () => {
  it("should render inputs", () => {
    const inputs = buildInputList(2);

    renderInputs({ inputs });

    expect(
      screen.getByLabelText(`${inputs[0].name} :: ${inputs[0].type}`)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(`${inputs[1].name} :: ${inputs[1].type}`)
    ).toBeInTheDocument();
  });

  it("should render the provided args", () => {
    const inputs = buildInputList(2);
    const args = ["arg1", "arg2"];

    renderInputs({ inputs, args });

    expect(screen.getByDisplayValue(args[0])).toBeInTheDocument();
    expect(screen.getByDisplayValue(args[1])).toBeInTheDocument();
  });

  it("should call updateArg when an input changes", async () => {
    const value = "a";
    const inputs = buildInputList(2);
    const args = ["", ""];
    const updateArg = jest.fn();

    const { user } = renderInputs({ inputs, args, updateArg });

    const input1 = screen.getByLabelText(
      `${inputs[0].name} :: ${inputs[0].type}`
    );

    await user.type(input1, value);

    await waitFor(() => {
      expect(updateArg).toHaveBeenCalledWith(0, value);
    });
  });
});
