import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentProfile } from "@/components/agent-profile";
import { fetchAgent } from "@/lib/api/agents";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/agents/[id]">): Promise<Metadata> {
  const { id } = await params;
  const agent = await fetchAgent(id);
  return { title: `${agent?.name ?? "Агент не найден"} · AgentClinic` };
}

export default async function AgentPage({ params }: PageProps<"/agents/[id]">) {
  const { id } = await params;
  const agent = await fetchAgent(id);
  if (!agent) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-8">
      <Link
        href="/agents"
        className="w-fit text-sm text-muted-foreground hover:text-foreground"
      >
        ← Все агенты
      </Link>
      <AgentProfile agent={agent} />
    </div>
  );
}
