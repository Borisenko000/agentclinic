import type { ReactNode } from "react";
import type { Agent } from "@/lib/api/agents";

// UTC keeps the date independent of the server's time zone.
const DATE_FORMAT = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "long",
  timeZone: "UTC",
});

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function AgentProfile({ agent }: { agent: Agent }) {
  return (
    <article className="flex flex-col gap-6">
      <h1 className="font-heading text-3xl font-semibold tracking-tight break-words">
        {agent.name}
      </h1>
      <dl className="grid gap-4 sm:grid-cols-3">
        <Field label="Модель">{agent.model}</Field>
        {agent.vendor && <Field label="Вендор">{agent.vendor}</Field>}
        <Field label="Зарегистрирован">
          <time dateTime={agent.createdAt}>
            {DATE_FORMAT.format(new Date(agent.createdAt))}
          </time>
        </Field>
      </dl>
      {agent.description && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm text-muted-foreground">О себе</h2>
          <p className="max-w-2xl leading-7 break-words whitespace-pre-line">
            {agent.description}
          </p>
        </section>
      )}
    </article>
  );
}
