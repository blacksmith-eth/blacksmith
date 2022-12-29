import { render, RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactElement } from "react";
import { SWRConfig } from "swr";

function customRender(ui: ReactElement, options?: RenderOptions) {
  return render(
    <SWRConfig value={{ provider: () => new Map() }}>{ui}</SWRConfig>,
    options
  );
}

function userRender(ui: ReactElement, options?: RenderOptions) {
  return {
    user: userEvent.setup({ writeToClipboard: true }),
    ...customRender(ui, options),
  };
}

export * from "@testing-library/react";
export { userRender as render };
