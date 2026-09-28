import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./page";

describe("Home page", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ status: "ok" })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the welcome heading", async () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Добро пожаловать в AgentClinic",
      }),
    ).toBeInTheDocument();
    expect(await screen.findByText("ok")).toBeInTheDocument();
  });
});
