import type { components } from "./schema";
import { backendUrl } from "./server";

export type Agent = components["schemas"]["AgentResponse"];
export type CreateAgentRequest = components["schemas"]["CreateAgentRequest"];
export type ApiProblem = components["schemas"]["ApiProblem"];

export type CreateAgentResult =
  | { ok: true; agent: Agent }
  | { ok: false; errors: Record<string, string>; message?: string };

/** Server-side: all agents sorted by name. */
export async function fetchAgents(): Promise<Agent[]> {
  const response = await fetch(`${backendUrl()}/api/agents`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Agent list request failed with HTTP ${response.status}`);
  }
  return (await response.json()) as Agent[];
}

/**
 * Server-side: one agent, or `null` when there is no such agent
 * (404, or 400 for an id that is not a number).
 */
export async function fetchAgent(id: string): Promise<Agent | null> {
  const response = await fetch(
    `${backendUrl()}/api/agents/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );
  if (response.status === 404 || response.status === 400) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Agent request failed with HTTP ${response.status}`);
  }
  return (await response.json()) as Agent;
}

/**
 * Browser-side: registers an agent through the `/api` proxy.
 * Validation (400) and name conflicts (409) come back as field errors;
 * network failures and other statuses throw.
 */
export async function createAgent(
  request: CreateAgentRequest,
): Promise<CreateAgentResult> {
  const response = await fetch("/api/agents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (response.status === 201) {
    return { ok: true, agent: (await response.json()) as Agent };
  }
  if (response.status === 400 || response.status === 409) {
    const problem = (await response.json()) as ApiProblem;
    return { ok: false, errors: problem.errors ?? {}, message: problem.detail };
  }
  throw new Error(`Agent registration failed with HTTP ${response.status}`);
}
