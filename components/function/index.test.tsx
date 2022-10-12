import { AbiStateMutability } from "core/types";
import { render, screen } from "testing";
import { buildAbiDefinedFunction, buildAddress } from "testing/factory";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import Function from ".";

jest.mock("wagmi");

const useContractReadMock = useContractRead as jest.Mock<any>;

useContractReadMock.mockReturnValue({
  data: undefined,
  isLoading: false,
  isError: false,
  refetch: jest.fn(),
});

const usePrepareContractWriteMock = usePrepareContractWrite as jest.Mock<any>;
usePrepareContractWriteMock.mockReturnValue({ config: {} });

const useContractWriteMock = useContractWrite as jest.Mock<any>;
useContractWriteMock.mockReturnValue({ write: jest.fn() });

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
