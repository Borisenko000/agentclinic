import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BackendStatus } from "./backend-status";

function mockFetch(implementation: () => Promise<Response>) {
  vi.stubGlobal("fetch", vi.fn(implementation));
}

describe("BackendStatus", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows a loading state while the request is pending", () => {
    mockFetch(() => new Promise<Response>(() => {}));

    render(<BackendStatus />);

    expect(screen.getByText("проверяем…")).toBeInTheDocument();
  });

  it("shows ok when the backend is healthy", async () => {
    mockFetch(async () => Response.json({ status: "ok" }));

    render(<BackendStatus />);

    expect(await screen.findByText("ok")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith("/api/health", expect.anything());
  });

  it("shows unavailable on a network error", async () => {
    mockFetch(async () => {
      throw new TypeError("Failed to fetch");
    });

    render(<BackendStatus />);

    expect(await screen.findByText("недоступен")).toBeInTheDocument();
  });

  it("shows unavailable on a non-2xx response", async () => {
    mockFetch(async () => new Response("Bad Gateway", { status: 502 }));

    render(<BackendStatus />);

    expect(await screen.findByText("недоступен")).toBeInTheDocument();
  });
});
