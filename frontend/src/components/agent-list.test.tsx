import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Agent } from "@/lib/api/agents";
import { AgentList } from "./agent-list";

const agents: Agent[] = [
  {
    id: 6,
    name: "Deprecated Dave",
    model: "GPT-3.5",
    vendor: null,
    description: null,
    createdAt: "2026-09-10T12:00:00Z",
  },
  {
    id: 1,
    name: "Overfit",
    model: "Llama 4",
    vendor: "Meta",
    description: "Описание",
    createdAt: "2026-09-01T09:00:00Z",
  },
];

describe("AgentList", () => {
  it("shows name, model and vendor of every agent in the given order", () => {
    render(<AgentList agents={agents} />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Deprecated Dave");
    expect(items[0]).toHaveTextContent("GPT-3.5");
    expect(items[1]).toHaveTextContent("Overfit");
    expect(items[1]).toHaveTextContent("Llama 4");
    expect(items[1]).toHaveTextContent("Meta");
  });

  it("links every agent to its profile", () => {
    render(<AgentList agents={agents} />);

    expect(
      screen.getByRole("link", { name: /Deprecated Dave/ }),
    ).toHaveAttribute("href", "/agents/6");
    expect(screen.getByRole("link", { name: /Overfit/ })).toHaveAttribute(
      "href",
      "/agents/1",
    );
  });

  it("does not render a vendor placeholder when the vendor is unknown", () => {
    render(<AgentList agents={agents} />);

    const dave = screen.getAllByRole("listitem")[0];
    expect(within(dave).queryByText("null")).not.toBeInTheDocument();
    expect(within(dave).queryByTestId("agent-vendor")).not.toBeInTheDocument();
  });

  it("shows an empty state with a link to registration", () => {
    render(<AgentList agents={[]} />);

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.getByText("Пока нет ни одного агента.")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Зарегистрировать первого агента" }),
    ).toHaveAttribute("href", "/agents/new");
  });
});
