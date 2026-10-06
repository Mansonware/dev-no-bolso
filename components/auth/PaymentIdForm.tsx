// Recuperação de acesso: quem pagou e fechou a página antes de criar a conta digita aqui
// o número do pagamento do comprovante do Mercado Pago. Formulário GET simples — funciona sem JavaScript.
export function PaymentIdForm({ error, defaultValue }: { error?: string; defaultValue?: string }) {
  return (
    <form action="/cadastro" method="get" className="flex flex-col gap-3">
      <div>
        <label htmlFor="payment_id" className="block text-sm font-semibold">
          Número do pagamento
        </label>
        <input
          id="payment_id"
          name="payment_id"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          required
          defaultValue={defaultValue}
          placeholder="Ex.: 123456789012"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "payment_id-erro payment_id-ajuda" : "payment_id-ajuda"}
          className={`mt-1.5 h-12 w-full rounded-xl border bg-[#050807] px-3.5 font-mono text-base text-[#F5F7F6] placeholder-slate-600 focus:outline-none focus:ring-1 ${
            error ? "border-red-400/60 focus:ring-red-400" : "border-white/15 focus:border-[#00FF88] focus:ring-[#00FF88]"
          }`}
        />
        {error && (
          <p id="payment_id-erro" role="alert" className="mt-1.5 text-sm text-red-400">
            {error}
          </p>
        )}
        <p id="payment_id-ajuda" className="mt-1.5 text-sm text-slate-400">
          Está no e-mail de confirmação do Mercado Pago ou no app, em Atividade → seu pagamento (“Número da operação”).
        </p>
      </div>
      <button
        type="submit"
        className="h-12 rounded-xl bg-[#00FF88] px-5 text-[15px] font-bold text-[#050807] transition-colors hover:bg-[#33FFA0]"
      >
        Continuar
      </button>
    </form>
  );
}
