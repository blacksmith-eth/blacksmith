import { AbiParameterWithComponents } from "core/types";
import { render, screen } from "testing";
import {
  buildAbiDefinedFunction,
  buildInputList,
  buildOutput,
  buildOutputList,
} from "testing/factory";
import { Signature } from ".";
import { act } from "@testing-library/react";

describe("Signature", () => {
  it("should expand and collapse a function signature", () => {
    const func = buildAbiDefinedFunction({ inputs: buildInputList(2) });
    let collapsed = true;
    let setCollapsed = () => {
      collapsed = !collapsed;
    };

    render(
      <Signature
        func={func}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
    );

    expect(screen.findAllByText(func.inputs[0].name!)).resolves.toHaveLength(0);
    act(() => {
      screen.getByTestId(`signature-toggle-collapse-${func.name}`).click();
    });
    expect(screen.findAllByText(func.inputs[0].name!)).resolves.toHaveLength(1);
  });

  it("should render a signature with a void return type", () => {
    const func = buildAbiDefinedFunction();
    let collapsed = false;
    let setCollapsed = () => {
      collapsed = !collapsed;
    };

    render(
      <Signature
        func={func}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
    );

    expect(
      screen.getByRole("heading", { level: 4, name: `${func.name} → void` })
    ).toBeInTheDocument();
  });

  it("should render a signature with a single return type", () => {
    const outputs = buildOutputList(1);
    const func = buildAbiDefinedFunction({ outputs });
    let collapsed = false;
    let setCollapsed = () => {
      collapsed = !collapsed;
    };

    render(
      <Signature
        func={func}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
    );

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
    let collapsed = false;
    let setCollapsed = () => {
      collapsed = !collapsed;
    };

    render(
      <Signature
        func={func}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
    );

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
    let collapsed = false;
    let setCollapsed = () => {
      collapsed = !collapsed;
    };

    render(
      <Signature
        func={func}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
    );

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
    let collapsed = false;
    let setCollapsed = () => {
      collapsed = !collapsed;
    };

    render(
      <Signature
        func={func}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
    );

    expect(
      screen.getByRole("heading", {
        level: 4,
        name: `${func.name} → [(${components[0].type}, ${components[1].type}), ${outputs[1].type}, ${outputs[2].type}]`,
      })
    ).toBeInTheDocument();
  });
});
