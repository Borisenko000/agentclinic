import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Agent } from "@/lib/api/agents";

export function AgentList({ agents }: { agents: Agent[] }) {
  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-start gap-2 text-muted-foreground">
        <p>Пока нет ни одного агента.</p>
        <Link
          href="/agents/new"
          className="text-foreground underline underline-offset-4"
        >
          Зарегистрировать первого агента
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {agents.map((agent) => (
        <li key={agent.id}>
          <Link
            href={`/agents/${agent.id}`}
            className="block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader>
                <CardTitle>{agent.name}</CardTitle>
                <CardDescription>
                  {agent.model}
                  {agent.vendor && (
                    <span data-testid="agent-vendor"> · {agent.vendor}</span>
                  )}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
