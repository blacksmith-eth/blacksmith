import { faker } from "@faker-js/faker";
import { AbiParameterWithComponents } from "core/types";
import { BigNumber } from "ethers";
import { times } from "lodash";
import { act, renderHook } from "testing";
import {
  buildAddress,
  buildArg,
  buildInput,
  buildInputList,
  buildInputWithComponents,
} from "testing/factory";
import { useArgs } from ".";

describe("useArgs", () => {
  it("should return args", () => {
    const inputs = buildInputList(0) as AbiParameterWithComponents[];
    const { result } = renderHook(() => useArgs(inputs));

    expect(result.current.args).toEqual([]);
  });

  it("should initialize each input with an empty string", () => {
    const inputs = buildInputList(2) as AbiParameterWithComponents[];
    const { result } = renderHook(() => useArgs(inputs));

    expect(result.current.args).toEqual([
      { name: inputs[0].name, type: inputs[0].type, value: "" },
      { name: inputs[1].name, type: inputs[1].type, value: "" },
    ]);
  });

  it("should initialize inputs for tuple types", () => {
    const input = buildInputWithComponents({
      components: buildInputList(2) as AbiParameterWithComponents[],
    });
    const { result } = renderHook(() => useArgs([input]));

    expect(result.current.args).toEqual([
      {
        name: input.name,
        type: input.type,
        value: [
          {
            name: input.components![0].name,
            type: input.components![0].type,
            value: "",
          },
          {
            name: input.components![1].name,
            type: input.components![1].type,
            value: "",
          },
        ],
      },
    ]);
  });

  it("should initialize inputs for array types", () => {
    const input = buildInput({
      type: "uint256[]",
    }) as AbiParameterWithComponents;
    const { result } = renderHook(() => useArgs([input]));

    expect(result.current.args).toEqual([
      {
        name: input.name,
        type: input.type,
        value: [],
        childArg: {
          name: input.type.slice(0, -2),
          type: input.type.slice(0, -2),
          value: "",
          childArg: undefined,
        },
      },
    ]);
  });

  it("should initialize inputs for array of tuple types", () => {
    const input = buildInputWithComponents({
      components: buildInputList(2) as AbiParameterWithComponents[],
      type: "tuple[]",
    });

    const { result } = renderHook(() => useArgs([input]));

    expect(result.current.args).toEqual([
      {
        name: input.name,
        type: input.type,
        value: [],
        childArg: {
          name: input.type.slice(0, -2),
          type: input.type.slice(0, -2),
          value: [
            {
              name: input.components![0].name,
              type: input.components![0].type,
              value: "",
              childArg: undefined,
            },
            {
              name: input.components![1].name,
              type: input.components![1].type,
              value: "",
              childArg: undefined,
            },
          ],
          childArg: undefined,
        },
      },
    ]);
  });

  it("should update the speficied arg", () => {
    const value = "foo";
    const input1 = buildInput({ type: "string" });
    const input2 = buildInput({ type: "string" });
    const inputs = [input1, input2] as AbiParameterWithComponents[];
    const { result } = renderHook(() => useArgs(inputs));

    act(() => {
      result.current.updateValue([1], value);
    });

    expect(result.current.args).toEqual([
      { name: input1.name, type: input1.type, value: "" },
      { name: input2.name, type: input2.type, value },
    ]);
  });

  it("should update the speficied arg for tuple types", () => {
    const value = "foo";
    const input = buildInputWithComponents({
      components: buildInputList(2) as AbiParameterWithComponents[],
    });
    const inputs = [input] as AbiParameterWithComponents[];
    const { result } = renderHook(() => useArgs(inputs));

    act(() => {
      result.current.updateValue([0, 1], value);
    });

    expect(result.current.args).toEqual([
      {
        name: input.name,
        type: input.type,
        value: [
          {
            name: input.components![0].name,
            type: input.components![0].type,
            value: "",
          },
          {
            name: input.components![1].name,
            type: input.components![1].type,
            value,
          },
        ],
      },
    ]);
  });

  it("should return formatted big number args", () => {
    const value = "1";
    const input = buildInput({ type: "uint256" });
    const { result } = renderHook(() =>
      useArgs([input] as AbiParameterWithComponents[])
    );

    act(() => {
      result.current.updateValue([0], value);
    });

    expect(result.current.formattedArgs).toEqual([BigNumber.from(value)]);
  });

  it("should return provided value when big number conversion throws", () => {
    const value = faker.random.word();
    const input = buildInput({ type: "uint256" });
    const { result } = renderHook(() =>
      useArgs([input] as AbiParameterWithComponents[])
    );

    act(() => {
      result.current.updateValue([0], value);
    });

    expect(result.current.formattedArgs).toEqual([value]);
  });

  it("should return formatted args for false boolean", () => {
    const value = "false";
    const input = buildInput({ type: "bool" });
    const { result } = renderHook(() =>
      useArgs([input] as AbiParameterWithComponents[])
    );

    act(() => {
      result.current.updateValue([0], value);
    });

    expect(result.current.formattedArgs).toEqual([false]);
  });

  it("should return formatted args for true boolean", () => {
    const value = "true";
    const input = buildInput({ type: "bool" });
    const { result } = renderHook(() =>
      useArgs([input] as AbiParameterWithComponents[])
    );

    act(() => {
      result.current.updateValue([0], value);
    });

    expect(result.current.formattedArgs).toEqual([true]);
  });

  it("should return formatted args for string array", () => {
    const strings = ["foo", "bar", "baz"];
    const input = buildInput({ type: "string[]" });
    const values = [
      buildArg({ type: "string", value: strings[0] }),
      buildArg({ type: "string", value: strings[1] }),
      buildArg({ type: "string", value: strings[2] }),
    ];
    const { result } = renderHook(() =>
      useArgs([input] as AbiParameterWithComponents[])
    );

    act(() => {
      result.current.updateValue([0], values);
    });

    expect(result.current.formattedArgs).toEqual([strings]);
  });

  it("should return formatted args for address array", () => {
    const addresses = times(3, () => buildAddress());
    const values = [
      buildArg({ type: "address", value: addresses[0] }),
      buildArg({ type: "address", value: addresses[1] }),
      buildArg({ type: "address", value: addresses[2] }),
    ];
    const input = buildInput({ type: "address[]" });
    const { result } = renderHook(() =>
      useArgs([input] as AbiParameterWithComponents[])
    );

    act(() => {
      result.current.updateValue([0], values);
    });

    expect(result.current.formattedArgs).toEqual([addresses]);
  });

  it("should return formatted args for uint256[]", () => {
    const values = [
      buildArg({ name: "uint256", type: "uint256", value: "1" }),
      buildArg({ name: "uint256", type: "uint256", value: "2" }),
      buildArg({ name: "uint256", type: "uint256", value: "3" }),
    ];
    const input = buildInput({ type: "uint256[]" });
    const { result } = renderHook(() =>
      useArgs([input] as AbiParameterWithComponents[])
    );

    act(() => {
      result.current.updateValue([0], values);
    });

    expect(result.current.formattedArgs).toEqual([
      [BigNumber.from(1), BigNumber.from(2), BigNumber.from(3)],
    ]);
  });

  it("should return formatted args for tuple", () => {
    const value = "foo";
    const components = buildInputList(2) as AbiParameterWithComponents[];
    const input = buildInputWithComponents({ type: "tuple", components });
    const { result } = renderHook(() => useArgs([input]));

    act(() => {
      result.current.updateValue([0, 1], value);
    });

    expect(result.current.formattedArgs).toEqual([
      {
        [input.components![0].name]: "",
        [input.components![1].name]: value,
      },
    ]);
  });

  it("should return fallback input name of input type ", () => {
    const input = buildInput({ name: "" });
    const { result } = renderHook(() =>
      useArgs([input] as AbiParameterWithComponents[])
    );

    expect(result.current.args[0].name).toEqual(input.type);
  });
});
