import type { components } from "./schema";
import { backendUrl } from "./server";

export type Agent = components["schemas"]["AgentResponse"];

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
