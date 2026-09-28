"use client";

import { useEffect, useState } from "react";
import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";
import { fetchHealth } from "@/lib/api/health";

type BadgeProps = ComponentProps<typeof Badge>;

type Status = "loading" | "ok" | "unavailable";

const LABELS: Record<Status, string> = {
  loading: "проверяем…",
  ok: "ok",
  unavailable: "недоступен",
};

const VARIANTS = {
  loading: "outline",
  ok: "default",
  unavailable: "destructive",
} as const satisfies Record<Status, BadgeProps["variant"]>;

export function BackendStatus() {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetchHealth(controller.signal)
      .then((health) =>
        setStatus(health.status === "ok" ? "ok" : "unavailable"),
      )
      .catch(() => {
        if (!controller.signal.aborted) {
          setStatus("unavailable");
        }
      });
    return () => controller.abort();
  }, []);

  return (
    <p className="flex items-center gap-2 text-sm text-muted-foreground">
      Статус бэкенда:
      <Badge
        variant={VARIANTS[status]}
        data-testid="backend-status"
        data-state={status}
      >
        {LABELS[status]}
      </Badge>
    </p>
  );
}
