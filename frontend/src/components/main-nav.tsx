"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";

const SECTIONS = [
  { href: "/", label: "Главная" },
  { href: "/agents", label: "Агенты" },
];

const UPCOMING_SECTIONS = ["Недуги"];

function isCurrent(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Основная навигация">
      <ul className="flex flex-wrap items-center gap-1">
        {SECTIONS.map(({ href, label }) => {
          const current = isCurrent(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={current ? "page" : undefined}
                className={buttonVariants({
                  variant: current ? "secondary" : "ghost",
                  size: "sm",
                })}
              >
                {label}
              </Link>
            </li>
          );
        })}
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
  );
}
