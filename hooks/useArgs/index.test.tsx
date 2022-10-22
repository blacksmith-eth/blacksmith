import { act, renderHook } from "testing";
import { buildAbiDefinedFunction, buildInputList } from "testing/factory";
import { useArgs } from ".";

describe("useArgs", () => {
  it("should return args", () => {
    const func = buildAbiDefinedFunction({ inputs: [] });
    const { result } = renderHook(() => useArgs(func));

    expect(result.current.args).toEqual([]);
  });

  it("should initialize each input with an empty string", () => {
    const inputs = buildInputList(2);
    const func = buildAbiDefinedFunction({ inputs });
    const { result } = renderHook(() => useArgs(func));

    expect(result.current.args).toEqual(["", ""]);
  });

  it("should update the speficied arg", () => {
    const value = "foo";
    const inputs = buildInputList(2);
    const func = buildAbiDefinedFunction({ inputs });
    const { result } = renderHook(() => useArgs(func));

    act(() => {
      result.current.updateArg(1, value);
    });

    expect(result.current.args).toEqual(["", value]);
  });
});
