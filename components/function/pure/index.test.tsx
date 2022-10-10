import { render, screen } from "testing";
import { buildAbiDefinedFunction, buildInputList } from "testing/factory";
import Pure from ".";

describe("Pure", () => {
  it("should render function name", () => {
    const func = buildAbiDefinedFunction();

    render(<Pure func={func} />);

    expect(screen.getByText(func.name, { exact: false })).toBeInTheDocument();
  });

  it("should render function inputs", () => {
    const inputs = buildInputList(2);
    const func = buildAbiDefinedFunction({ inputs });

    render(<Pure func={func} />);

    func.inputs.forEach((input) => {
      expect(
        screen.getByLabelText(`${input.name} :: ${input.type}`)
      ).toBeInTheDocument();
    });
  });
});
