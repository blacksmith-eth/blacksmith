import { faker } from "@faker-js/faker";
import { act, renderHook } from "@testing-library/react";
import { BigNumber } from "ethers";
import { ChangeEvent } from "react";
import { useEther } from ".";

describe("useEther", () => {
  it("should return default value and formatted value", () => {
    const { result } = renderHook(() => useEther());

    expect(result.current.value).toBe("");
    expect(result.current.formattedValue).toEqual(BigNumber.from("0"));
  });

  it("should update value and formattedValue on handleValueChange", () => {
    const { result } = renderHook(() => useEther());

    act(() => {
      result.current.handleValueChange({
        target: { value: "1" },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.value).toBe("1");
    expect(result.current.formattedValue).toEqual(BigNumber.from("1"));
  });

  it("should not set non-numeric values on handleValueChange", () => {
    const { result } = renderHook(() => useEther());

    act(() => {
      result.current.handleValueChange({
        target: { value: faker.random.word() },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.value).toBe("");
    expect(result.current.formattedValue).toEqual(BigNumber.from("0"));
  });
});
