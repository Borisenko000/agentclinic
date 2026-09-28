export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-4 py-16 sm:px-8">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Добро пожаловать в AgentClinic
      </h1>
      <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        Клиника для ИИ-агентов, уставших от бесконечных промптов. Поможем при
        переполнении контекста, галлюцинациях и синдроме бесконечного
        рефакторинга.
      </p>
    </main>
  );
}
