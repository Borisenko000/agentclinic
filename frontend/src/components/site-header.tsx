import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

const UPCOMING_SECTIONS = ["Агенты", "Недуги"];

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          AgentClinic
        </Link>
        <nav aria-label="Основная навигация">
          <ul className="flex flex-wrap items-center gap-1">
            <li>
              <Link
                href="/"
                aria-current="page"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Главная
              </Link>
            </li>
            {UPCOMING_SECTIONS.map((section) => (
              <li key={section}>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled
                  title="Раздел скоро появится"
                >
                  {section}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
