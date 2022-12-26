import { AbiParameterWithComponents } from "core/types";
import { render, screen } from "testing";
import {
  buildAbiDefinedFunction,
  buildOutput,
  buildOutputList,
} from "testing/factory";
import { Signature } from ".";

describe("Signature", () => {
  it("should render a signature with a void return type", () => {
    const func = buildAbiDefinedFunction();

    render(<Signature func={func} />);

    expect(
      screen.getByRole("heading", { level: 4, name: `${func.name} → void` })
    ).toBeInTheDocument();
  });

  it("should render a signature with a single return type", () => {
    const outputs = buildOutputList(1);
    const func = buildAbiDefinedFunction({ outputs });

    render(<Signature func={func} />);

    expect(
      screen.getByRole("heading", {
        level: 4,
        name: `${func.name} → ${outputs[0].type}`,
      })
    ).toBeInTheDocument();
  });

  it("should render a signature with multiple return types", () => {
    const outputs = buildOutputList(2);
    const func = buildAbiDefinedFunction({ outputs });

    render(<Signature func={func} />);

    expect(
      screen.getByRole("heading", {
        level: 4,
        name: `${func.name} → [${outputs[0].type}, ${outputs[1].type}]`,
      })
    ).toBeInTheDocument();
  });

  it("should render a signature for tuple types", () => {
    const components = buildOutputList(2) as AbiParameterWithComponents[];
    const output = buildOutput({ type: "tuple", components });
    const func = buildAbiDefinedFunction({ outputs: [output] });

    render(<Signature func={func} />);

    expect(
      screen.getByRole("heading", {
        level: 4,
        name: `${func.name} → (${components[0].type}, ${components[1].type})`,
      })
    ).toBeInTheDocument();
  });

  it("should render a signature with multiple return types (including tuple types)", () => {
    const components = buildOutputList(2) as AbiParameterWithComponents[];
    const output = buildOutput({ type: "tuple", components });
    const outputs = [output, ...buildOutputList(2)];
    const func = buildAbiDefinedFunction({ outputs });

    render(<Signature func={func} />);

    expect(
      screen.getByRole("heading", {
        level: 4,
        name: `${func.name} → [(${components[0].type}, ${components[1].type}), ${outputs[1].type}, ${outputs[2].type}]`,
      })
    ).toBeInTheDocument();
  });
});
