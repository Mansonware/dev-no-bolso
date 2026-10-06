"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { AuthField } from "./AuthField";
import { FormAlert } from "./FormAlert";
import { submitAuth } from "./submitAuth";
import {
  PASSWORD_MIN_LENGTH,
  hasErrors,
  validateSignup,
  type FieldErrors,
  type SignupValues,
} from "@/lib/validateAuthForm";

type Props = {
  paymentId: string;
};

export function SignupForm({ paymentId }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<SignupValues>({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FieldErrors<SignupValues>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const update = (field: keyof SignupValues) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;

    const nextErrors = validateSignup(values);
    setErrors(nextErrors);
    setFormError(null);
    if (hasErrors(nextErrors)) return;

    setPending(true);
    const result = await submitAuth("/api/auth/register", { ...values, paymentId });
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
        id="name"
        label="Nome"
        type="text"
        value={values.name}
        onChange={update("name")}
        autoComplete="name"
        placeholder="Como quer ser chamado"
        error={errors.name}
      />
      <div>
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
        <p className="mt-1.5 text-xs text-slate-500">Use o mesmo e-mail que você informou no Mercado Pago.</p>
      </div>
      <AuthField
        id="password"
        label="Senha"
        type="password"
        value={values.password}
        onChange={update("password")}
        autoComplete="new-password"
        placeholder={`Mínimo de ${PASSWORD_MIN_LENGTH} caracteres`}
        error={errors.password}
      />
      <AuthField
        id="confirmPassword"
        label="Confirmar senha"
        type="password"
        value={values.confirmPassword}
        onChange={update("confirmPassword")}
        autoComplete="new-password"
        error={errors.confirmPassword}
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-2 h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-5 text-sm font-bold text-[#050807] transition-all hover:bg-[#33FFA0] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
            <span>Confirmando pagamento…</span>
          </>
        ) : (
          <>
            <span>Criar minha conta</span>
            <ArrowRight className="w-4 h-4" aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}
