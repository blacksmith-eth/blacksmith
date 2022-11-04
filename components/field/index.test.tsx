import { faker } from "@faker-js/faker";
import { ComponentProps } from "react";
import { render, screen } from "testing";
import Field from ".";

const renderField = (props: Partial<ComponentProps<typeof Field>> = {}) => {
  return render(
    <Field
      handleChange={props.handleChange || jest.fn()}
      id={props.id || "id"}
      inputName={props.inputName || "inputName"}
      type={props.type || "type"}
      value={props.value || ""}
    />
  );
};

describe("Field", () => {
  it("should render the input name as the label", () => {
    const inputName = faker.random.word();
    renderField({ inputName });

    expect(screen.getByLabelText(inputName)).toBeInTheDocument();
  });

  it("should render the input type", () => {
    const type = faker.random.word();
    renderField({ type });

    expect(screen.getByText(type)).toBeInTheDocument();
  });

  it("should render the input value", () => {
    const value = faker.random.word();
    renderField({ value });

    expect(screen.getByDisplayValue(value)).toBeInTheDocument();
  });

  it("should call the handleChange function when the input value changes", async () => {
    const inputName = faker.random.word();
    const handleChange = jest.fn();

    const { user } = renderField({ handleChange, inputName });

    const input = screen.getByLabelText(inputName);
    const value = faker.random.word();

    await user.type(input, value);

    expect(handleChange).toHaveBeenCalled();
  });
});
