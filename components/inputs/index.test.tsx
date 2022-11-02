import { ComponentProps } from "react";
import { render, screen, waitFor } from "testing";
import {
  buildArg,
  buildArgList,
  buildInput,
  buildInputList,
} from "testing/factory";
import Inputs from ".";

const renderInputs = (props: Partial<ComponentProps<typeof Inputs>>) => {
  return render(
    <Inputs
      name={props.name || ""}
      args={props.args || []}
      updateValue={props.updateValue || jest.fn()}
    />
  );
};

describe("Inputs", () => {
  it("should render inputs", () => {
    const args = buildArgList(2);

    renderInputs({ args });

    expect(
      screen.getByLabelText(`${args[0].name} :: ${args[0].type}`)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(`${args[1].name} :: ${args[1].type}`)
    ).toBeInTheDocument();
  });

  it("should render the provided args", () => {
    const args = [buildArg({ value: "foo" }), buildArg({ value: "bar" })];

    renderInputs({ args });

    expect(screen.getByDisplayValue(args[0].value)).toBeInTheDocument();
    expect(screen.getByDisplayValue(args[1].value)).toBeInTheDocument();
  });

  it("should call updateValue when an input changes", async () => {
    const value = "a";
    const args = buildArgList(2);
    const updateValue = jest.fn();

    const { user } = renderInputs({ args, updateValue });

    const input1 = screen.getByLabelText(`${args[0].name} :: ${args[0].type}`);

    await user.type(input1, value);

    await waitFor(() => {
      expect(updateValue).toHaveBeenCalledWith(0, value);
    });
  });

  it("should render fallback names if the input names are not provided", () => {
    const arg1 = buildArg({ name: "", type: "string" });
    const arg2 = buildArg({ name: "", type: "address" });

    renderInputs({ args: [arg1, arg2] });

    expect(
      screen.getByLabelText(`keyOrIndex :: ${arg1.type}`)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(`keyOrIndex :: ${arg2.type}`)
    ).toBeInTheDocument();
  });
});
