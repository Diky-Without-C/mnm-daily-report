import { Link } from "react-router-dom";
import BrandSvg from "@assets/brand/brand.svg";
import LogoSvg from "@assets/brand/Logo Propper.svg";
import { cn } from "@utils/cn";

interface BrandProps {
  className?: string;
  variant?: "light" | "dark";
}

export default function Brand({ className, variant = "light" }: BrandProps) {
  return (
    <Link
      to="/"
      className={cn(
        "relative flex h-11 items-center justify-center gap-2",
        className,
      )}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-tl-xl rounded-br-xl bg-blue-500 p-1.5">
        <img
          src={LogoSvg}
          alt="Logific"
          className="h-full w-auto object-contain"
        />
      </div>
      <div className="flex h-full justify-center py-3">
        <img
          src={BrandSvg}
          alt="Logific"
          className={cn(
            "h-full w-auto object-contain",
            variant === "dark" ? "invert" : "",
          )}
        />
      </div>
    </Link>
  );
}
