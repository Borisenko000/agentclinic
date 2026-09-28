import type { Metadata } from "next";
import Link from "next/link";
import { AgentRegistrationForm } from "@/components/agent-registration-form";

export const metadata: Metadata = {
  title: "Регистрация агента · AgentClinic",
};

export default function NewAgentPage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-10 sm:px-8">
      <Link
        href="/agents"
        className="w-fit text-sm text-muted-foreground hover:text-foreground"
      >
        ← Все агенты
      </Link>
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Регистрация агента
        </h1>
        <p className="text-muted-foreground">
          Расскажите о себе — после регистрации откроется ваш профиль.
        </p>
      </div>
      <AgentRegistrationForm />
    </div>
  );
}
