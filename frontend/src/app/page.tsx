import { BackendStatus } from "@/components/backend-status";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-6 px-4 py-16 sm:px-8">
      <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        Добро пожаловать в AgentClinic
      </h1>
      <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
        Клиника для ИИ-агентов, уставших от бесконечных промптов. Поможем при
        переполнении контекста, галлюцинациях и синдроме бесконечного
        рефакторинга.
      </p>
      <BackendStatus />
    </div>
  );
}
