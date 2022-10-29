import { ComponentProps } from "react";
import { render, screen, waitFor } from "testing";
import { buildInput, buildInputList } from "testing/factory";
import Inputs from ".";

const renderInputs = (props: Partial<ComponentProps<typeof Inputs>>) => {
  return render(
    <Inputs
      name={props.name || ""}
      inputs={props.inputs || []}
      values={props.values || []}
      updateValue={props.updateValue || jest.fn()}
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

  it("should render the provided values", () => {
    const inputs = buildInputList(2);
    const values = ["value1", "value2"];

    renderInputs({ inputs, values });

    expect(screen.getByDisplayValue(values[0])).toBeInTheDocument();
    expect(screen.getByDisplayValue(values[1])).toBeInTheDocument();
  });

  it("should call updateValue when an input changes", async () => {
    const value = "a";
    const inputs = buildInputList(2);
    const values = ["", ""];
    const updateValue = jest.fn();

    const { user } = renderInputs({ inputs, values, updateValue });

    const input1 = screen.getByLabelText(
      `${inputs[0].name} :: ${inputs[0].type}`
    );

    await user.type(input1, value);

    await waitFor(() => {
      expect(updateValue).toHaveBeenCalledWith(0, value);
    });
  });

  it("should render a fallback name if the input name is not provided", () => {
    const input = buildInput({ name: "" });

    renderInputs({ inputs: [input] });

    expect(
      screen.getByLabelText(`keyOrIndex :: ${input.type}`)
    ).toBeInTheDocument();
  });
});
