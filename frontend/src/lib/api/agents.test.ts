import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type Agent, createAgent, fetchAgent, fetchAgents } from "./agents";

const agent: Agent = {
  id: 1,
  name: "Overfit",
  model: "Llama 4",
  vendor: "Meta",
  description: null,
  createdAt: "2026-09-01T09:00:00Z",
};

function mockFetch(response: Response) {
  const fetchMock = vi.fn(async () => response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("agents API (server)", () => {
  beforeEach(() => {
    vi.stubEnv("BACKEND_URL", "http://backend.test:9090");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("fetches the agent list from the backend without caching", async () => {
    const fetchMock = mockFetch(Response.json([agent]));

    await expect(fetchAgents()).resolves.toEqual([agent]);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://backend.test:9090/api/agents",
      expect.objectContaining({ cache: "no-store" }),
    );
  });

  it("throws when the agent list request fails", async () => {
    mockFetch(new Response("Bad Gateway", { status: 502 }));

    await expect(fetchAgents()).rejects.toThrow("HTTP 502");
  });

  it("fetches a single agent by id", async () => {
    const fetchMock = mockFetch(Response.json(agent));

    await expect(fetchAgent("1")).resolves.toEqual(agent);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://backend.test:9090/api/agents/1",
      expect.objectContaining({ cache: "no-store" }),
    );
  });

  it("returns null for an unknown agent", async () => {
    mockFetch(new Response(null, { status: 404 }));

    await expect(fetchAgent("999999")).resolves.toBeNull();
  });

  it("returns null for an id the backend rejects as malformed", async () => {
    mockFetch(new Response(null, { status: 400 }));

    await expect(fetchAgent("abc")).resolves.toBeNull();
  });

  it("throws when the agent request fails on the server", async () => {
    mockFetch(new Response(null, { status: 500 }));

    await expect(fetchAgent("1")).rejects.toThrow("HTTP 500");
  });

  it("uses localhost:8080 when BACKEND_URL is not set", async () => {
    vi.unstubAllEnvs();
    vi.stubEnv("BACKEND_URL", undefined);
    const fetchMock = mockFetch(Response.json([]));

    await fetchAgents();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/api/agents",
      expect.anything(),
    );
  });
});

describe("createAgent (browser, via the /api proxy)", () => {
  const form = { name: "Новый", model: "GPT-5", vendor: "", description: "" };

  function problem(status: number, body: object) {
    return new Response(JSON.stringify({ status, ...body }), {
      status,
      headers: { "Content-Type": "application/problem+json" },
    });
  }

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts the form to the proxy and returns the created agent", async () => {
    const fetchMock = mockFetch(Response.json(agent, { status: 201 }));

    await expect(createAgent(form)).resolves.toEqual({ ok: true, agent });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/agents",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }),
    );
  });

  it("returns field errors for a validation problem", async () => {
    mockFetch(
      problem(400, {
        title: "Bad Request",
        detail: "Проверьте поля формы",
        errors: { name: "Укажите имя" },
      }),
    );

    await expect(createAgent(form)).resolves.toEqual({
      ok: false,
      errors: { name: "Укажите имя" },
      message: "Проверьте поля формы",
    });
  });

  it("returns the name error for a conflict", async () => {
    mockFetch(
      problem(409, {
        title: "Conflict",
        errors: { name: "Агент с таким именем уже зарегистрирован" },
      }),
    );

    await expect(createAgent(form)).resolves.toMatchObject({
      ok: false,
      errors: { name: "Агент с таким именем уже зарегистрирован" },
    });
  });

  it("throws on an unexpected server error", async () => {
    mockFetch(new Response("Bad Gateway", { status: 502 }));

    await expect(createAgent(form)).rejects.toThrow("HTTP 502");
  });
});
