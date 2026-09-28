"use client";

import { useEffect, useState } from "react";
import { fetchHealth } from "@/lib/api/health";

type Status = "loading" | "ok" | "unavailable";

const LABELS: Record<Status, string> = {
  loading: "проверяем…",
  ok: "ok",
  unavailable: "недоступен",
};

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
    <p className="text-sm text-zinc-600 dark:text-zinc-400">
      Статус бэкенда:{" "}
      <span data-status={status} className="font-medium">
        {LABELS[status]}
      </span>
    </p>
  );
}
