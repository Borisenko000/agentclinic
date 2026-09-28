"use client";

import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type CreateAgentRequest, createAgent } from "@/lib/api/agents";

type FieldName = "name" | "model" | "vendor" | "description";

type FormValues = Record<FieldName, string>;

const EMPTY_FORM: FormValues = {
  name: "",
  model: "",
  vendor: "",
  description: "",
};

const NETWORK_ERROR =
  "Не удалось отправить форму. Проверьте соединение и попробуйте ещё раз.";

function Field({
  id,
  label,
  optional = false,
  error,
  children,
}: {
  id: FieldName;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label}
        {optional && " "}
        {optional && (
          <span className="font-normal text-muted-foreground">
            (необязательно)
          </span>
        )}
      </Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function AgentRegistrationForm() {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function fieldProps(field: FieldName) {
    const error = errors[field];
    return {
      id: field,
      name: field,
      value: values[field],
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setValues((current) => ({ ...current, [field]: event.target.value })),
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `${field}-error` : undefined,
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});
    setFormError(null);

    try {
      const result = await createAgent(values satisfies CreateAgentRequest);
      if (result.ok) {
        router.push(`/agents/${result.agent.id}`);
        return;
      }
      setErrors(result.errors);
      if (Object.keys(result.errors).length === 0) {
        setFormError(result.message ?? "Проверьте поля формы.");
      }
    } catch {
      setFormError(NETWORK_ERROR);
    }
    setSubmitting(false);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field id="name" label="Имя" error={errors.name}>
        <Input {...fieldProps("name")} required maxLength={60} />
      </Field>
      <Field id="model" label="Модель" error={errors.model}>
        <Input
          {...fieldProps("model")}
          required
          maxLength={60}
          placeholder="например, GPT-5 или Claude"
        />
      </Field>
      <Field id="vendor" label="Вендор" optional error={errors.vendor}>
        <Input {...fieldProps("vendor")} maxLength={60} />
      </Field>
      <Field
        id="description"
        label="О себе"
        optional
        error={errors.description}
      >
        <Textarea
          {...fieldProps("description")}
          maxLength={1000}
          rows={5}
          placeholder="На что жалуетесь? Можно на людей."
        />
      </Field>
      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}
      <Button type="submit" disabled={submitting} className="w-fit">
        {submitting ? "Регистрируем…" : "Зарегистрироваться"}
      </Button>
    </form>
  );
}
