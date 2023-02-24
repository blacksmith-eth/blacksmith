import { renderHook, waitFor } from "testing";
import { server } from "mocks/server";
import { rest } from "msw";
import { useContracts } from ".";
import { SWRConfig } from "swr";
import { PropsWithChildren } from "react";
import { buildContractDetailsList } from "testing/factory";

const wrapper = ({ children }: PropsWithChildren<Record<string, any>>) => (
  <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
);

describe("useContracts", () => {
  it("should return initial loading state", async () => {
    const { result } = renderHook(() => useContracts(), { wrapper });

    await waitFor(() => {
      expect(result.current.contracts).toEqual([]);
      expect(result.current.isLoading).toEqual(true);
      expect(result.current.isError).toEqual(false);
    });
  });

  it("should return contracts", async () => {
    const contracts = buildContractDetailsList(2);
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => {
        return res(ctx.json(contracts));
      })
    );
    const { result } = renderHook(() => useContracts(), { wrapper });

    await waitFor(() => {
      expect(result.current.contracts).toEqual(contracts);
      expect(result.current.isLoading).toEqual(false);
      expect(result.current.isError).toEqual(false);
    });
  });

  it("should return error", async () => {
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    const { result } = renderHook(() => useContracts(), { wrapper });

    await waitFor(() => {
      expect(result.current.contracts).toEqual([]);
      expect(result.current.isLoading).toEqual(false);
      expect(result.current.isError).toEqual(true);
    });
  });
});
