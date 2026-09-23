"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AuthField } from "./AuthField";
import {
  PASSWORD_MIN_LENGTH,
  hasErrors,
  validateSignup,
  type FieldErrors,
  type SignupValues,
} from "@/lib/validateAuthForm";

export function SignupForm() {
  const router = useRouter();
  const [values, setValues] = useState<SignupValues>({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FieldErrors<SignupValues>>({});

  const update = (field: keyof SignupValues) => (value: string) => {
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
        const nextErrors = validateSignup(values);
        setErrors(nextErrors);
        if (hasErrors(nextErrors)) return;

        // MOCK: não existe cadastro real ainda. Nenhum dado é enviado ou salvo;
        // o formulário válido apenas navega para a área do aluno.
        router.push("/aluno");
      }}
      className="flex flex-col gap-4"
    >
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
        className="mt-2 h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-5 text-sm font-bold text-[#050807] transition-all hover:bg-[#33FFA0] active:scale-[0.98]"
      >
        <span>Criar minha conta</span>
        <ArrowRight className="w-4 h-4" aria-hidden />
      </button>
    </form>
  );
}
