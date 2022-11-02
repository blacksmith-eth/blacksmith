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
      inputs={props.inputs || []}
      values={props.values || []}
      updateValue={props.updateValue || jest.fn()}
    />
  );
};

describe("Inputs", () => {
  it("should render inputs", () => {
    const inputs = buildInputList(2);
    const values = buildArgList(2);

    renderInputs({ inputs, values });

    expect(
      screen.getByLabelText(`${inputs[0].name} :: ${inputs[0].type}`)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(`${inputs[1].name} :: ${inputs[1].type}`)
    ).toBeInTheDocument();
  });

  it("should render the provided values", () => {
    const inputs = buildInputList(2);
    const values = [buildArg({ value: "foo" }), buildArg({ value: "bar" })];

    renderInputs({ inputs, values });

    expect(screen.getByDisplayValue(values[0].value)).toBeInTheDocument();
    expect(screen.getByDisplayValue(values[1].value)).toBeInTheDocument();
  });

  it("should call updateValue when an input changes", async () => {
    const value = "a";
    const inputs = buildInputList(2);
    const values = buildArgList(2);
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

  it("should render fallback names if the input names are not provided", () => {
    const input1 = buildInput({ name: "", type: "address" });
    const input2 = buildInput({ name: "", type: "uint256" });
    const values = buildArgList(2);

    renderInputs({ inputs: [input1, input2], values });

    expect(
      screen.getByLabelText(`keyOrIndex :: ${input1.type}`)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(`keyOrIndex :: ${input2.type}`)
    ).toBeInTheDocument();
  });
});
