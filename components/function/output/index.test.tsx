import { BigNumber } from "ethers";
import { render, screen } from "testing";
import { buildResult } from "testing/factory";
import { PartialProps } from "testing/types";
import { Output } from ".";

const renderOutput = (props: PartialProps<typeof Output> = {}) =>
  render(
    <Output
      data={props.data || undefined}
      isTouched={props.isTouched || false}
      isLoading={props.isLoading || false}
      isError={props.isError || false}
      error={props.error || null}
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

  it("should not render error when not touched ", () => {
    renderOutput({ isError: true, isTouched: false });

    expect(screen.queryByText("Error")).not.toBeInTheDocument();
  });

  it("should render error when touched ", () => {
    renderOutput({ isError: true, isTouched: true });

    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("should render error without reason", () => {
    renderOutput({ error: {}, isError: true, isTouched: true });

    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("should render error message", () => {
    renderOutput({ error: { reason: "foo" }, isError: true, isTouched: true });

    expect(screen.getByText("Error: foo")).toBeInTheDocument();
  });
});
