import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SiteLayout } from "./site-layout";

const navigation = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
}));

function renderAt(pathname: string) {
  navigation.pathname = pathname;
  render(
    <SiteLayout>
      <p>Содержимое страницы</p>
    </SiteLayout>,
  );
  return screen.getByRole("navigation", { name: "Основная навигация" });
}

describe("SiteLayout", () => {
  afterEach(() => {
    navigation.pathname = "/";
  });

  it("renders header, navigation, content and footer", () => {
    const nav = renderAt("/");

    const header = screen.getByRole("banner");
    expect(within(header).getByText("AgentClinic")).toBeInTheDocument();

    expect(within(nav).getByRole("link", { name: "Главная" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(within(nav).getByRole("link", { name: "Агенты" })).toHaveAttribute(
      "href",
      "/agents",
    );
    expect(within(nav).getByRole("button", { name: "Недуги" })).toBeDisabled();

    expect(screen.getByRole("main")).toHaveTextContent("Содержимое страницы");
    expect(screen.getByRole("contentinfo")).toHaveTextContent("AgentClinic");
  });

  it("marks the home link as current on the home page", () => {
    const nav = renderAt("/");

    expect(within(nav).getByRole("link", { name: "Главная" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      within(nav).getByRole("link", { name: "Агенты" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("marks the agents link as current on the agents page", () => {
    const nav = renderAt("/agents");

    expect(within(nav).getByRole("link", { name: "Агенты" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      within(nav).getByRole("link", { name: "Главная" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("keeps the agents link current inside the agents section", () => {
    const nav = renderAt("/agents/1");

    expect(within(nav).getByRole("link", { name: "Агенты" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
