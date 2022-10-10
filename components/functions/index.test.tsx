import { render, screen } from "testing";
import { buildAbiDefinedFunctionList } from "testing/factory";
import Functions from ".";

describe("Functions", () => {
  it("should render no functions message when no functions are provided", () => {
    render(<Functions functions={[]} />);

    expect(screen.getByText("no functions")).toBeInTheDocument();
  });

  it("should render functions", () => {
    const functions = buildAbiDefinedFunctionList(2);

    render(<Functions functions={functions} />);

    expect(
      screen.getByText(functions[0].name, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(functions[1].name, { exact: false })
    ).toBeInTheDocument();
  });
});
