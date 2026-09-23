"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AuthField } from "./AuthField";
import { hasErrors, validateLogin, type FieldErrors, type LoginValues } from "@/lib/validateAuthForm";

export function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState<LoginValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors<LoginValues>>({});

  const update = (field: keyof LoginValues) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    // method="post" garante que a senha nunca vá para a query string, mesmo sem JavaScript.
    <form
      method="post"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const nextErrors = validateLogin(values);
        setErrors(nextErrors);
        if (hasErrors(nextErrors)) return;

        // MOCK: não existe autenticação real ainda. Nenhum dado é enviado ou salvo;
        // o formulário válido apenas navega para a área do aluno.
        router.push("/aluno");
      }}
      className="flex flex-col gap-4"
    >
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
        className="mt-2 h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-5 text-sm font-bold text-[#050807] transition-all hover:bg-[#33FFA0] active:scale-[0.98]"
      >
        <span>Entrar</span>
        <ArrowRight className="w-4 h-4" aria-hidden />
      </button>
    </form>
  );
}
