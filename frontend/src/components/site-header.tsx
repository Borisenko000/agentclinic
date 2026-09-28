import Link from "next/link";
import { MainNav } from "@/components/main-nav";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          AgentClinic
        </Link>
        <MainNav />
      </div>
    </header>
  );
}
