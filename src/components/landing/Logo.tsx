import Image from "next/image";
import { SITE } from "@/config/site";

/** Official Mon Bilan Eau logo (transparent PNG, 900×529). */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/images/logo-mon-bilan-eau.png"
      alt={SITE.name}
      width={900}
      height={529}
      priority
      className={`h-[68px] w-auto sm:h-[80px] ${className}`}
    />
  );
}
