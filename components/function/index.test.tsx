import { AbiStateMutability } from "core/types";
import { render, screen } from "testing";
import { buildAbiDefinedFunction, buildAddress } from "testing/factory";
import type { Mock } from "vitest";
import { useContractRead, useContractWrite } from "wagmi";
import { Function } from ".";

vi.mock("wagmi");

const useContractReadMock = useContractRead as Mock;

useContractReadMock.mockReturnValue({
  data: undefined,
  isLoading: false,
  isError: false,
  refetch: vi.fn(),
});

const useContractWriteMock = useContractWrite as Mock;
useContractWriteMock.mockReturnValue({ write: vi.fn() });

describe("Function", () => {
  it.each(["pure", "view", "nonpayable", "payable"] as AbiStateMutability[])(
    "should render a %s function",
    (stateMutability) => {
      const func = buildAbiDefinedFunction({
        stateMutability,
      });

      render(<Function address={buildAddress()} func={func} />);

      expect(
        screen.getByText(stateMutability, { exact: false })
      ).toBeInTheDocument();
    }
  );
});
