import { render, screen } from "testing";
import { buildInputList } from "testing/factory";
import Inputs from ".";

describe("Inputs", () => {
  it("should render inputs", () => {
    const inputs = buildInputList(2);

    render(<Inputs name={""} inputs={inputs} />);

    expect(
      screen.getByLabelText(`${inputs[0].name} :: ${inputs[0].type}`)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(`${inputs[1].name} :: ${inputs[1].type}`)
    ).toBeInTheDocument();
  });
});
