"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { AuthField } from "./AuthField";
import { FormAlert } from "./FormAlert";
import { submitAuth } from "./submitAuth";
import { hasErrors, validateLogin, type FieldErrors, type LoginValues } from "@/lib/validateAuthForm";

type Props = {
  next: string;
};

export function LoginForm({ next }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<LoginValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors<LoginValues>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const update = (field: keyof LoginValues) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;

    const nextErrors = validateLogin(values);
    setErrors(nextErrors);
    setFormError(null);
    if (hasErrors(nextErrors)) return;

    setPending(true);
    const result = await submitAuth("/api/auth/login", { ...values, next });
    if (result.ok) {
      router.replace(result.redirectTo);
      router.refresh();
      return;
    }

    setPending(false);
    setFormError(result.error);
    if (result.fieldErrors) setErrors(result.fieldErrors);
  }

  return (
    // method="post" garante que a senha nunca vá para a query string, mesmo sem JavaScript.
    <form method="post" noValidate onSubmit={onSubmit} className="flex flex-col gap-4" aria-busy={pending}>
      {formError && <FormAlert message={formError} />}

      <AuthField
        id="email"
        label="E-mail"
        type="email"
        value={values.email}
        onChange={update("email")}
        autoComplete="email"
        placeholder="voce@email.com"
        error={errors.email}
      />
      <AuthField
        id="password"
        label="Senha"
        type="password"
        value={values.password}
        onChange={update("password")}
        autoComplete="current-password"
        error={errors.password}
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-2 h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-5 text-sm font-bold text-[#050807] transition-all hover:bg-[#33FFA0] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
            <span>Entrando…</span>
          </>
        ) : (
          <>
            <span>Entrar</span>
            <ArrowRight className="w-4 h-4" aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}
