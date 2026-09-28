"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AgentsError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="mx-auto flex w-full max-w-5xl flex-col items-start gap-4 px-4 py-10 sm:px-8"
    >
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        Не удалось загрузить агентов
      </h1>
      <p className="text-muted-foreground">
        Бэкенд недоступен или ответил ошибкой. Попробуйте ещё раз через минуту.
      </p>
      <Button variant="outline" onClick={() => retry()}>
        Повторить
      </Button>
    </div>
  );
}
