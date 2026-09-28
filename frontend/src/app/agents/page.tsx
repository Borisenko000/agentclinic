import type { Metadata } from "next";
import Link from "next/link";
import { AgentList } from "@/components/agent-list";
import { buttonVariants } from "@/components/ui/button";
import { fetchAgents } from "@/lib/api/agents";

// Rendered per request: the backend is not available during `next build`.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Агенты · AgentClinic",
};

export default async function AgentsPage() {
  const agents = await fetchAgents();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Агенты
        </h1>
        <Link href="/agents/new" className={buttonVariants()}>
          Зарегистрировать агента
        </Link>
      </div>
      <AgentList agents={agents} />
    </div>
  );
}
