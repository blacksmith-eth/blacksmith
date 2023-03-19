import { server } from "mocks/server";
import { rest } from "msw";
import { render, screen } from "testing";
import { buildAddress } from "testing/factory";
import { Manager } from ".";

describe("Manager", () => {
  it("should handle contract imports", async () => {
    const address = buildAddress();
    server.use(
      rest.post(`/api/contracts/${address}`, (_req, res, ctx) =>
        res(ctx.json({}))
      )
    );
    const { user } = render(<Manager />);
    const input = screen.getByLabelText("contract address");

    await user.type(input, address);

    const button = screen.getByRole("button", { name: "import" });

    await user.click(button);

    await screen.findByText("Imported successfully");
  });

  it("should handle failed contract imports", async () => {
    const address = buildAddress();
    server.use(
      rest.post(`/api/contracts/${address}`, (_req, res, ctx) =>
        res(ctx.status(500))
      )
    );
    const { user } = render(<Manager />);
    const input = screen.getByLabelText("contract address");

    await user.type(input, address);

    const button = screen.getByRole("button", { name: "import" });

    await user.click(button);

    await screen.findByText("Import failed");
  });

  it("should handle contract removals", async () => {
    const address = buildAddress();
    server.use(
      rest.delete(`/api/contracts/${address}`, (_req, res, ctx) =>
        res(ctx.json({}))
      )
    );
    const { user } = render(<Manager />);
    const input = screen.getByLabelText("contract address");

    await user.type(input, address);

    const button = screen.getByRole("button", { name: "remove" });

    await user.click(button);

    await screen.findByText("Removed successfully");
  });

  it("should handle failed contract removals", async () => {
    const address = buildAddress();
    server.use(
      rest.delete(`/api/contracts/${address}`, (_req, res, ctx) =>
        res(ctx.status(500))
      )
    );
    const { user } = render(<Manager />);
    const input = screen.getByLabelText("contract address");

    await user.type(input, address);

    const button = screen.getByRole("button", { name: "remove" });

    await user.click(button);

    await screen.findByText("Remove failed");
  });

  it("should handle all contract removals", async () => {
    server.use(
      rest.delete("/api/contracts", (_req, res, ctx) => res(ctx.json({})))
    );
    const { user } = render(<Manager />);
    const button = screen.getByRole("button", { name: "remove all" });

    await user.click(button);

    await screen.findByText("Removed all contracts");
  });
});
