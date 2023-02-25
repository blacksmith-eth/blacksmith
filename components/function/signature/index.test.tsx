import { AbiParameterWithComponents } from "core/types";
import { render, screen } from "testing";
import {
  buildAbiDefinedFunction,
  buildInputList,
  buildOutput,
  buildOutputList,
} from "testing/factory";
import { PartialProps } from "testing/types";
import { Signature } from ".";

const renderSignature = (props: PartialProps<typeof Signature>) =>
  render(
    <Signature
      func={props.func || buildAbiDefinedFunction()}
      collapsed={props.collapsed || false}
      toggleCollapsed={props.toggleCollapsed || vi.fn()}
    />
  );

describe("Signature", () => {
  it("should render collapse icon when expanded", () => {
    const func = buildAbiDefinedFunction({ inputs: buildInputList(1) });

    renderSignature({ collapsed: false, func });

    const collapseButton = screen.getByRole("button", { name: "Collapse" });

    expect(collapseButton).toBeInTheDocument();
  });

  it("should render expand icon when collapsed", () => {
    const func = buildAbiDefinedFunction({ inputs: buildInputList(1) });

    renderSignature({ collapsed: true, func });

    const expandButton = screen.getByRole("button", { name: "Expand" });

    expect(expandButton).toBeInTheDocument();
  });

  it("should call toggleCollapsed function when the toggle is clicked", async () => {
    const func = buildAbiDefinedFunction();
    const toggleCollapsed = vi.fn();

    const { user } = renderSignature({ func, toggleCollapsed });

    const collapseButton = screen.getByRole("button", { name: "Collapse" });
    await user.click(collapseButton);

    expect(toggleCollapsed).toHaveBeenCalledOnce();
  });

  it("should render a signature with a void return type", () => {
    const func = buildAbiDefinedFunction();

    renderSignature({ func });

    expect(
      screen.getByRole("heading", { level: 4, name: `${func.name} → void` })
    ).toBeInTheDocument();
  });

  it("should render a signature with a single return type", () => {
    const outputs = buildOutputList(1);
    const func = buildAbiDefinedFunction({ outputs });

    renderSignature({ func });

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

    renderSignature({ func });

    expect(
      screen.getByRole("heading", {
        level: 4,
        name: `${func.name} → [${outputs[0].type}, ${outputs[1].type}]`,
      })
    ).toBeInTheDocument();
  });

  it("should render a signature for tuple types", () => {
    const components = buildOutputList(2) as AbiParameterWithComponents[];
    const output = buildOutput({ components, type: "tuple" });
    const func = buildAbiDefinedFunction({ outputs: [output] });

    renderSignature({ func });

    expect(
      screen.getByRole("heading", {
        level: 4,
        name: `${func.name} → (${components[0].type}, ${components[1].type})`,
      })
    ).toBeInTheDocument();
  });

  it("should render a signature with multiple return types (including tuple types)", () => {
    const components = buildOutputList(2) as AbiParameterWithComponents[];
    const output = buildOutput({ components, type: "tuple" });
    const outputs = [output, ...buildOutputList(2)];
    const func = buildAbiDefinedFunction({ outputs });

    renderSignature({ func });

    expect(
      screen.getByRole("heading", {
        level: 4,
        name: `${func.name} → [(${components[0].type}, ${components[1].type}), ${outputs[1].type}, ${outputs[2].type}]`,
      })
    ).toBeInTheDocument();
  });
});
