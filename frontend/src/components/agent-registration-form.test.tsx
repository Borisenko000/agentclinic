import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AgentRegistrationForm } from "./agent-registration-form";

const router = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => router,
}));

function mockFetch(implementation: () => Promise<Response>) {
  const fetchMock = vi.fn(implementation);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function problem(status: number, errors: Record<string, string>) {
  return new Response(JSON.stringify({ status, title: "Error", errors }), {
    status,
    headers: { "Content-Type": "application/problem+json" },
  });
}

function fillAndSubmit(values: { name?: string; model?: string } = {}) {
  fireEvent.change(screen.getByLabelText("Имя"), {
    target: { value: values.name ?? "Новый Пациент" },
  });
  fireEvent.change(screen.getByLabelText("Модель"), {
    target: { value: values.model ?? "GPT-5" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Зарегистрироваться" }));
}

describe("AgentRegistrationForm", () => {
  beforeEach(() => {
    router.push.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("mirrors the server limits in the HTML attributes", () => {
    render(<AgentRegistrationForm />);

    expect(screen.getByLabelText("Имя")).toBeRequired();
    expect(screen.getByLabelText("Имя")).toHaveAttribute("maxLength", "60");
    expect(screen.getByLabelText("Модель")).toBeRequired();
    expect(screen.getByLabelText("Модель")).toHaveAttribute("maxLength", "60");
    expect(screen.getByLabelText(/Вендор/)).not.toBeRequired();
    expect(screen.getByLabelText(/Вендор/)).toHaveAttribute("maxLength", "60");
    expect(screen.getByLabelText(/О себе/)).toHaveAttribute(
      "maxLength",
      "1000",
    );
  });

  it("sends the form and opens the new agent's profile on success", async () => {
    const fetchMock = mockFetch(async () =>
      Response.json(
        {
          id: 42,
          name: "Новый Пациент",
          model: "GPT-5",
          vendor: null,
          description: null,
          createdAt: "2026-09-28T10:00:00Z",
        },
        { status: 201 },
      ),
    );
    render(<AgentRegistrationForm />);

    fillAndSubmit();

    await vi.waitFor(() =>
      expect(router.push).toHaveBeenCalledWith("/agents/42"),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/agents",
      expect.objectContaining({
        body: JSON.stringify({
          name: "Новый Пациент",
          model: "GPT-5",
          vendor: "",
          description: "",
        }),
      }),
    );
  });

  it("shows validation errors next to the fields", async () => {
    mockFetch(async () =>
      problem(400, {
        name: "Длина от 2 до 60 символов",
        model: "Укажите модель",
      }),
    );
    render(<AgentRegistrationForm />);

    fillAndSubmit({ name: "Я", model: "" });

    const nameError = await screen.findByText("Длина от 2 до 60 символов");
    const name = screen.getByLabelText("Имя");
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription("Длина от 2 до 60 символов");
    expect(nameError).toBeInTheDocument();
    expect(screen.getByLabelText("Модель")).toHaveAccessibleDescription(
      "Укажите модель",
    );
    expect(router.push).not.toHaveBeenCalled();
  });

  it("shows a taken name as an error of the name field", async () => {
    mockFetch(async () =>
      problem(409, { name: "Агент с таким именем уже зарегистрирован" }),
    );
    render(<AgentRegistrationForm />);

    fillAndSubmit({ name: "overfit" });

    await vi.waitFor(() =>
      expect(screen.getByLabelText("Имя")).toHaveAccessibleDescription(
        "Агент с таким именем уже зарегистрирован",
      ),
    );
    expect(router.push).not.toHaveBeenCalled();
  });

  it("shows a general message on a network error", async () => {
    mockFetch(async () => {
      throw new TypeError("Failed to fetch");
    });
    render(<AgentRegistrationForm />);

    fillAndSubmit();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Не удалось отправить форму",
    );
    expect(router.push).not.toHaveBeenCalled();
  });

  it("clears previous errors on a new submission", async () => {
    mockFetch(async () => problem(400, { name: "Укажите имя" }));
    render(<AgentRegistrationForm />);
    fillAndSubmit({ name: "" });
    await screen.findByText("Укажите имя");

    mockFetch(() => new Promise<Response>(() => {}));
    fillAndSubmit();

    await vi.waitFor(() =>
      expect(screen.queryByText("Укажите имя")).not.toBeInTheDocument(),
    );
  });

  it("disables the submit button while the request is in flight", async () => {
    mockFetch(() => new Promise<Response>(() => {}));
    render(<AgentRegistrationForm />);

    fillAndSubmit();

    expect(
      await screen.findByRole("button", { name: "Регистрируем…" }),
    ).toBeDisabled();
  });
});
