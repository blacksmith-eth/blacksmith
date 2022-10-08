import { act, renderHook } from "testing";
import { useToggle } from ".";

describe("useToggle", () => {
  it("should default to false", () => {
    const { result } = renderHook(() => useToggle());

    expect(result.current.state).toBe(false);
  });

  it.each([true, false])(
    "should set the state to the initial state (%s)",
    (initialState) => {
      const { result } = renderHook(() => useToggle(initialState));

      expect(result.current.state).toBe(initialState);
    }
  );

  it("#toggle should toggle the state", () => {
    const { result } = renderHook(() => useToggle(false));

    expect(result.current.state).toBe(false);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.state).toBe(true);
  });

  it("#setTrue should set the state to true", () => {
    const { result } = renderHook(() => useToggle(false));

    expect(result.current.state).toBe(false);

    act(() => {
      result.current.setTrue();
    });

    expect(result.current.state).toBe(true);
  });

  it("#setFalse should set the state to false", () => {
    const { result } = renderHook(() => useToggle(true));

    expect(result.current.state).toBe(true);

    act(() => {
      result.current.setFalse();
    });

    expect(result.current.state).toBe(false);
  });
});
