import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { server } from "mocks/server";
import "whatwg-fetch";

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
