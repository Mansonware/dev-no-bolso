type Props = {
  id: string;
  label: string;
  type: "text" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  error?: string;
  placeholder?: string;
};

export function AuthField({ id, label, type, value, onChange, autoComplete, error, placeholder }: Props) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-[#F5F7F6]">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        autoCapitalize={type === "text" ? "words" : "none"}
        spellCheck={false}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`mt-1.5 h-12 w-full rounded-xl border bg-[#050807] px-3.5 text-base text-[#F5F7F6] placeholder-slate-600 focus:outline-none focus:ring-1 ${
          error
            ? "border-red-400/60 focus:border-red-400 focus:ring-red-400"
            : "border-white/15 focus:border-[#00FF88] focus:ring-[#00FF88]"
        }`}
      />
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
