import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteLayout } from "./site-layout";

describe("SiteLayout", () => {
  it("renders header, navigation, content and footer", () => {
    render(
      <SiteLayout>
        <p>Содержимое страницы</p>
      </SiteLayout>,
    );

    const header = screen.getByRole("banner");
    expect(within(header).getByText("AgentClinic")).toBeInTheDocument();

    const nav = screen.getByRole("navigation", { name: "Основная навигация" });
    expect(within(nav).getByRole("link", { name: "Главная" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(within(nav).getByRole("button", { name: "Агенты" })).toBeDisabled();
    expect(within(nav).getByRole("button", { name: "Недуги" })).toBeDisabled();

    expect(screen.getByRole("main")).toHaveTextContent("Содержимое страницы");
    expect(screen.getByRole("contentinfo")).toHaveTextContent("AgentClinic");
  });
});
