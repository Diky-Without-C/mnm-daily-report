import { Link } from "react-router-dom";
import BrandSvg from "@assets/brand/brand.svg";
import { cn } from "@utils/cn";

interface BrandProps {
  className?: string;
}

export default function Brand({ className }: BrandProps) {
  return (
    <Link
      to="/"
      className={cn(
        "relative flex h-12 items-center justify-center gap-2",
        className,
      )}
    >
      <div className="flex h-full justify-center py-3">
        <img
          src={BrandSvg}
          alt="Logific"
          className="h-full w-auto object-contain"
        />
      </div>
    </Link>
  );
}
