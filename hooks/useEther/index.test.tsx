import { faker } from "@faker-js/faker/locale/en";
import { act, renderHook } from "@testing-library/react";
import { ChangeEvent } from "react";
import { Units, useEther } from ".";

describe("useEther", () => {
  it("should return default value, unit, and formatted value", () => {
    const { result } = renderHook(() => useEther());

    expect(result.current.value).toBe("");
    expect(result.current.unit).toBe("wei");
    expect(result.current.formattedValue).toEqual(0n);
  });

  it("should update value and formattedValue on handleValueChange", () => {
    const { result } = renderHook(() => useEther());

    act(() => {
      result.current.handleValueChange({
        target: { value: "1" },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.value).toBe("1");
    expect(result.current.formattedValue).toEqual(1n);
  });

  it("should not set non-numeric values on handleValueChange", () => {
    const { result } = renderHook(() => useEther());

    act(() => {
      result.current.handleValueChange({
        target: { value: faker.string.alpha() },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.value).toBe("");
    expect(result.current.formattedValue).toEqual(0n);
  });

  it("should update unit on setUnit", () => {
    const { result } = renderHook(() => useEther());

    act(() => {
      result.current.setUnit(Units.ether);
    });

    expect(result.current.unit).toBe("ether");
  });

  it("should adjust fomattedValue based on unit selection", () => {
    const { result } = renderHook(() => useEther());

    act(() => {
      result.current.handleValueChange({
        target: { value: "1" },
      } as ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.setUnit(Units.ether);
    });

    expect(result.current.value).toBe("1");
    expect(result.current.formattedValue).toEqual(1000000000000000000n);
  });
});
