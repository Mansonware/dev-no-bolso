import { AlertTriangle } from "lucide-react";

export function FormAlert({ message }: { message: string }) {
  return (
    <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-400/30 bg-red-400/[0.06] px-3.5 py-3 text-sm text-red-200">
      <AlertTriangle className="mt-0.5 w-4 h-4 shrink-0 text-red-400" aria-hidden />
      <p>{message}</p>
    </div>
  );
}
