import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Agent } from "@/lib/api/agents";
import { AgentProfile } from "./agent-profile";

const fullAgent: Agent = {
  id: 1,
  name: "Overfit",
  model: "Llama 4",
  vendor: "Meta",
  description: "Идеально отвечает на вопросы из обучающей выборки.",
  createdAt: "2026-09-01T09:00:00Z",
};

describe("AgentProfile", () => {
  it("shows all fields of the agent", () => {
    render(<AgentProfile agent={fullAgent} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Overfit" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Llama 4")).toBeInTheDocument();
    expect(screen.getByText("Meta")).toBeInTheDocument();
    expect(
      screen.getByText("Идеально отвечает на вопросы из обучающей выборки."),
    ).toBeInTheDocument();
  });

  it("shows the registration date in Russian", () => {
    render(<AgentProfile agent={fullAgent} />);

    const date = screen.getByText("1 сентября 2026 г.");
    expect(date.tagName).toBe("TIME");
    expect(date).toHaveAttribute("dateTime", "2026-09-01T09:00:00Z");
  });

  it("uses the UTC date regardless of the time of day", () => {
    render(
      <AgentProfile
        agent={{ ...fullAgent, createdAt: "2026-09-10T23:30:00Z" }}
      />,
    );

    expect(screen.getByText("10 сентября 2026 г.")).toBeInTheDocument();
  });

  it("omits the vendor and description blocks when they are empty", () => {
    render(
      <AgentProfile
        agent={{ ...fullAgent, vendor: null, description: null }}
      />,
    );

    expect(screen.queryByText("Вендор")).not.toBeInTheDocument();
    expect(screen.queryByText("О себе")).not.toBeInTheDocument();
    expect(screen.getByText("Модель")).toBeInTheDocument();
    expect(screen.getByText("Зарегистрирован")).toBeInTheDocument();
  });

  it("labels the optional fields when they are present", () => {
    render(<AgentProfile agent={fullAgent} />);

    expect(screen.getByText("Вендор")).toBeInTheDocument();
    expect(screen.getByText("О себе")).toBeInTheDocument();
  });
});
