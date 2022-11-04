import { ComponentProps } from "react";
import { render, screen, waitFor } from "testing";
import { buildArg, buildArgList } from "testing/factory";
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

    expect(screen.getByLabelText(args[0].name)).toBeInTheDocument();
    expect(screen.getByLabelText(args[1].name)).toBeInTheDocument();
  });

  it("should render the type of the input", () => {
    const arg = buildArg();

    renderInputs({ args: [arg] });

    expect(screen.getByText(arg.type)).toBeInTheDocument();
  });

  it("should render the provided args", () => {
    const value1 = "foo";
    const value2 = "bar";
    const args = [buildArg({ value: value1 }), buildArg({ value: value2 })];

    renderInputs({ args });

    expect(screen.getByDisplayValue(value1)).toBeInTheDocument();
    expect(screen.getByDisplayValue(value2)).toBeInTheDocument();
  });

  it("should call updateValue when an input changes", async () => {
    const value = "a";
    const args = buildArgList(2);
    const updateValue = jest.fn();

    const { user } = renderInputs({ args, updateValue });

    const input1 = screen.getByLabelText(args[0].name);

    await user.type(input1, value);

    await waitFor(() => {
      expect(updateValue).toHaveBeenCalledWith([0], value);
    });
  });

  it("should call updateValue when a tuple input changes", async () => {
    const value = "a";
    const component1 = buildArg({ name: "foo" });
    const component2 = buildArg({ name: "bar" });
    const arg = buildArg({ value: [component1, component2] });
    const updateValue = jest.fn();

    const { user } = renderInputs({ args: [arg], updateValue });

    const input1 = screen.getByLabelText(component1.name);
    const input2 = screen.getByLabelText(component2.name);

    await user.type(input1, value);

    await waitFor(() => {
      expect(updateValue).toHaveBeenCalledWith([0, 0], value);
    });

    await user.type(input2, value);

    await waitFor(() => {
      expect(updateValue).toHaveBeenCalledWith([0, 1], value);
    });
  });

  it("should render fallback names if the input names are not provided", () => {
    const arg1 = buildArg({ name: "", type: "string" });
    const arg2 = buildArg({ name: "", type: "address" });

    renderInputs({ args: [arg1, arg2] });

    const inputs = screen.getAllByLabelText("keyOrIndex");
    expect(inputs.length).toBe(2);
  });
});
