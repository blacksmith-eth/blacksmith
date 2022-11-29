import { faker } from "@faker-js/faker";
import { AbiParameterWithComponents } from "core/types";
import { BigNumber } from "ethers";
import { times } from "lodash";
import { act, renderHook, waitFor } from "testing";
import {
  buildAddress,
  buildArg,
  buildInput,
  buildInputList,
  buildInputWithComponents,
} from "testing/factory";
import { useArgs } from ".";

describe("useArgs", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should return args", () => {
    const inputs = buildInputList(0) as AbiParameterWithComponents[];
    const { result } = renderHook(() => useArgs(inputs));

    expect(result.current.args).toEqual([]);
  });

  it("should initialize each input with an empty string", () => {
    const inputs = buildInputList(2) as AbiParameterWithComponents[];
    const { result } = renderHook(() => useArgs(inputs));

    expect(result.current.args).toEqual([
      buildArg({ name: inputs[0].name, type: inputs[0].type, value: "" }),
      buildArg({ name: inputs[1].name, type: inputs[1].type, value: "" }),
    ]);
  });

  it("should initialize inputs for tuple types", () => {
    const input = buildInputWithComponents({
      components: buildInputList(2) as AbiParameterWithComponents[],
    });
    const { result } = renderHook(() => useArgs([input]));

    expect(result.current.args).toEqual([
      buildArg({
        name: input.name,
        type: input.type,
        value: [
          buildArg({
            name: input.components![0].name,
            type: input.components![0].type,
            value: "",
          }),
          buildArg({
            name: input.components![1].name,
            type: input.components![1].type,
            value: "",
          }),
        ],
      }),
    ]);
  });

  it("should initialize inputs for array types", () => {
    const input = buildInput({
      type: "uint256[]",
    }) as AbiParameterWithComponents;
    const { result } = renderHook(() => useArgs([input]));

    expect(result.current.args).toEqual([
      buildArg({
        name: input.name,
        type: input.type,
        value: [],
        isInfinite: true,
        childArg: buildArg({
          name: input.type.slice(0, -2),
          type: input.type.slice(0, -2),
          value: "",
        }),
      }),
    ]);
  });

  it("should initialize inputs for array of tuple types", () => {
    const input = buildInputWithComponents({
      components: buildInputList(2) as AbiParameterWithComponents[],
      type: "tuple[]",
    });

    const { result } = renderHook(() => useArgs([input]));

    expect(result.current.args).toEqual([
      buildArg({
        name: input.name,
        type: input.type,
        value: [],
        isInfinite: true,
        childArg: buildArg({
          name: input.type.slice(0, -2),
          type: input.type.slice(0, -2),
          value: [
            buildArg({
              name: input.components![0].name,
              type: input.components![0].type,
              value: "",
            }),
            buildArg({
              name: input.components![1].name,
              type: input.components![1].type,
              value: "",
            }),
          ],
        }),
      }),
    ]);
  });

  it("should initialize inputs for fixed size array types", () => {
    const input = buildInput({
      type: "uint256[2]",
    }) as AbiParameterWithComponents;
    const { result } = renderHook(() => useArgs([input]));

    const childValue = buildArg({
      name: input.type.slice(0, -3),
      type: input.type.slice(0, -3),
      value: "",
    });

    expect(result.current.args).toEqual([
      buildArg({
        name: input.name,
        type: input.type,
        value: [childValue, childValue],
      }),
    ]);
  });

  it("should initialize inputs for multidimensional fixed size array types", () => {
    const input = buildInput({
      type: "uint256[1][2]",
    }) as AbiParameterWithComponents;

    const { result } = renderHook(() => useArgs([input]));

    const firstDimensionType = input.type.slice(0, -3);
    const secondDimensionType = firstDimensionType.slice(0, -3);
    const childValue = buildArg({
      name: firstDimensionType,
      type: firstDimensionType,
      value: [
        buildArg({
          name: secondDimensionType,
          type: secondDimensionType,
          value: "",
        }),
      ],
    });

    expect(result.current.args).toEqual([
      buildArg({
        name: input.name,
        type: input.type,
        value: [childValue, childValue],
      }),
    ]);
  });

  it("should initialize inputs for multidimensional fixed and dynamic size array types", () => {
    const input = buildInput({
      type: "uint256[2][]",
    }) as AbiParameterWithComponents;

    const { result } = renderHook(() => useArgs([input]));

    const firstDimensionType = input.type.slice(0, -2);
    const secondDimensionType = firstDimensionType.slice(0, -3);
    const childValue = buildArg({
      name: secondDimensionType,
      type: secondDimensionType,
      value: "",
    });
    expect(result.current.args).toEqual([
      {
        name: input.name,
        type: input.type,
        value: [],
        isInfinite: true,
        childArg: buildArg({
          name: firstDimensionType,
          type: firstDimensionType,
          value: [childValue, childValue],
        }),
      },
    ]);
  });

  it("should initialize inputs for multidimensional dynamic and fixed size array types", () => {
    const input = buildInput({
      type: "uint256[][2]",
    }) as AbiParameterWithComponents;
    const { result } = renderHook(() => useArgs([input]));

    const firstDimensionType = input.type.slice(0, -3);
    const secondDimensionType = firstDimensionType.slice(0, -2);
    const childValue = buildArg({
      name: firstDimensionType,
      type: firstDimensionType,
      value: [],
      isInfinite: true,
      childArg: buildArg({
        name: secondDimensionType,
        type: secondDimensionType,
        value: "",
        childArg: undefined,
      }),
    });

    expect(result.current.args).toEqual([
      buildArg({
        name: input.name,
        type: input.type,
        value: [childValue, childValue],
      }),
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
      buildArg({ name: input1.name, type: input1.type, value: "" }),
      buildArg({ name: input2.name, type: input2.type, value: "foo" }),
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
      buildArg({
        name: input.name,
        type: input.type,
        value: [
          buildArg({
            name: input.components![0].name,
            type: input.components![0].type,
            value: "",
          }),
          buildArg({
            name: input.components![1].name,
            type: input.components![1].type,
            value,
          }),
        ],
      }),
    ]);
  });

  it("should return formatted big number args", async () => {
    const value = "1";
    const input = buildInput({ type: "uint256" });
    const { result } = renderHook(() =>
      useArgs([input] as AbiParameterWithComponents[])
    );

    act(() => {
      result.current.updateValue([0], value);
    });

    await waitFor(() => {
      expect(result.current.formattedArgs).toEqual([BigNumber.from(value)]);
    });
  });

  it("should return provided value when big number conversion throws", async () => {
    const value = faker.random.word();
    const input = buildInput({ type: "uint256" });
    const { result } = renderHook(() =>
      useArgs([input] as AbiParameterWithComponents[])
    );

    act(() => {
      result.current.updateValue([0], value);
    });

    await waitFor(() => {
      expect(result.current.formattedArgs).toEqual([value]);
    });
  });

  it("should return formatted args for false boolean", async () => {
    const value = "false";
    const input = buildInput({ type: "bool" });
    const { result } = renderHook(() =>
      useArgs([input] as AbiParameterWithComponents[])
    );

    act(() => {
      result.current.updateValue([0], value);
    });

    await waitFor(() => {
      expect(result.current.formattedArgs).toEqual([false]);
    });
  });

  it("should return formatted args for true boolean", async () => {
    const value = "true";
    const input = buildInput({ type: "bool" });
    const { result } = renderHook(() =>
      useArgs([input] as AbiParameterWithComponents[])
    );

    act(() => {
      result.current.updateValue([0], value);
    });

    await waitFor(() => {
      expect(result.current.formattedArgs).toEqual([true]);
    });
  });

  it("should return formatted args for string array", async () => {
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

    await waitFor(() => {
      expect(result.current.formattedArgs).toEqual([strings]);
    });
  });

  it("should return formatted args for address array", async () => {
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

    await waitFor(() => {
      expect(result.current.formattedArgs).toEqual([addresses]);
    });
  });

  it("should return formatted args for uint256[]", async () => {
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

    await waitFor(() => {
      expect(result.current.formattedArgs).toEqual([
        [BigNumber.from(1), BigNumber.from(2), BigNumber.from(3)],
      ]);
    });
  });

  it("should return formatted args for tuple", async () => {
    const value = "foo";
    const components = buildInputList(2) as AbiParameterWithComponents[];
    const input = buildInputWithComponents({ type: "tuple", components });
    const { result } = renderHook(() => useArgs([input]));

    act(() => {
      result.current.updateValue([0, 1], value);
    });

    await waitFor(() => {
      expect(result.current.formattedArgs).toEqual([
        {
          [input.components![0].name]: "",
          [input.components![1].name]: value,
        },
      ]);
    });
  });

  it("should return fallback input name of input type ", () => {
    const input = buildInput({ name: "" });
    const { result } = renderHook(() =>
      useArgs([input] as AbiParameterWithComponents[])
    );

    expect(result.current.args[0].name).toEqual(input.type);
  });
});
