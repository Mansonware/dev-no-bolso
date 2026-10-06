import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CTA, FREE_MISSION_HREF } from "@/lib/offer";

type Props = {
  label?: string;
  size?: "compact" | "default" | "large";
  variant?: "primary" | "secondary";
  className?: string;
  id?: string;
};

export function FreeMissionLink({
  label = CTA.freeMission,
  size = "large",
  variant = "primary",
  className = "",
  id,
}: Props) {
  const sizeClasses = {
    compact: "h-11 px-4 text-sm",
    default: "h-12 px-5 text-[15px]",
    large: "h-14 px-6 text-base",
  }[size];

  const variantClasses =
    variant === "primary"
      ? "bg-[#00FF88] text-[#050807] hover:bg-[#33FFA0]"
      : "border border-white/15 text-[#F5F7F6] hover:border-white/30 hover:bg-white/[0.03]";

  return (
    <Link
      id={id}
      href={FREE_MISSION_HREF}
      className={`group inline-flex w-full items-center justify-center gap-2 rounded-xl font-bold transition-colors active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00FF88] ${variantClasses} ${sizeClasses} ${className}`}
    >
      {label}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}
