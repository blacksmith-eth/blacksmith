import { render } from "@testing-library/react";
import Home from "pages/index";

describe("Home", () => {
  it("should render without crashing", () => {
    render(<Home />);
  });
});
