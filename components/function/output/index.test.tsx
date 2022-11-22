import { BigNumber } from "ethers";
import { ComponentProps } from "react";
import { render, screen } from "testing";
import { buildResult } from "testing/factory";
import Output from ".";

const renderOutput = (props: Partial<ComponentProps<typeof Output>> = {}) =>
  render(
    <Output
      data={props.data || undefined}
      isLoading={props.isLoading || false}
      isError={props.isError || false}
    />
  );

describe("Output", () => {
  it("should render string data", () => {
    const data = buildResult("test");
    renderOutput({ data });

    expect(screen.getByText("test")).toBeInTheDocument();
  });

  it("should render false boolean", () => {
    const data = buildResult("false");
    renderOutput({ data });

    expect(screen.getByText("false")).toBeInTheDocument();
  });

  it("should render array data", () => {
    const data = buildResult(["test", "test2"]);
    renderOutput({ data });

    expect(screen.getByText("(test, test2)")).toBeInTheDocument();
  });

  it("should render an array of big numbers", () => {
    const data = buildResult([BigNumber.from(0), BigNumber.from(1)]);
    renderOutput({ data });

    expect(screen.getByText("(0, 1)")).toBeInTheDocument();
  });

  it("should render nested tuple data", () => {
    const data = buildResult(["test", ["test2", "test3"]]);
    renderOutput({ data });

    expect(screen.getByText("(test, (test2, test3))")).toBeInTheDocument();
  });

  it("should render loading", () => {
    renderOutput({ isLoading: true });

    expect(screen.getByText("loading...")).toBeInTheDocument();
  });

  it("should render error", () => {
    renderOutput({ isError: true });

    expect(screen.getByText("error")).toBeInTheDocument();
  });
});
