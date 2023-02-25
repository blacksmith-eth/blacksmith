import { render, screen, waitFor } from "testing";
import { buildArg, buildArgList } from "testing/factory";
import { PartialProps } from "testing/types";
import { Inputs } from ".";

const renderInputs = (props: PartialProps<typeof Inputs>) =>
  render(
    <Inputs
      name={props.name || ""}
      args={props.args || []}
      updateValue={props.updateValue || vi.fn()}
      preview={props.preview}
      child={props.child}
      keys={props.keys}
    />
  );

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
    const updateValue = vi.fn();

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
    const arg = buildArg({ type: "tuple", value: [component1, component2] });
    const updateValue = vi.fn();

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

  it("should call updateValue with added list item when add is clicked", async () => {
    const arg = buildArg({ isInfinite: true });
    const updateValue = vi.fn();

    const { user } = renderInputs({ args: [arg], updateValue });

    const addButton = screen.getByRole("button", { name: "+ add" });

    await user.click(addButton);

    expect(updateValue).toHaveBeenCalledWith([0], [arg.childArg]);
  });

  it("should call updateValue with removed list item when remove is clicked (array value)", async () => {
    const arg = buildArg({ isInfinite: false, value: [] });
    const updateValue = vi.fn();

    const { user } = renderInputs({
      args: [arg],
      child: true,
      keys: [0],
      preview: false,
      updateValue,
    });

    const removeButton = screen.getByRole("button", { name: "- remove" });

    await user.click(removeButton);

    expect(updateValue).toHaveBeenCalledWith([0], []);
  });

  it("should call updateValue with removed list item when remove is clicked (string value)", async () => {
    const arg = buildArg({ isInfinite: false, value: "" });
    const updateValue = vi.fn();

    const { user } = renderInputs({
      args: [arg],
      child: true,
      keys: [0],
      preview: false,
      updateValue,
    });

    const removeButton = screen.getByRole("button", { name: "- remove" });

    await user.click(removeButton);

    expect(updateValue).toHaveBeenCalledWith([0], []);
  });

  it("should render childArg preview for infinite list", () => {
    const childArg = buildArg();
    const arg = buildArg({ childArg, isInfinite: true });

    renderInputs({ args: [arg] });

    expect(screen.getByText(childArg.name)).toBeInTheDocument();
  });
});
