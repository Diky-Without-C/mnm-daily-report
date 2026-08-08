import { Link } from "react-router-dom";
import BrandSvg from "@assets/brand/brand.svg";
import LogoSvg from "@assets/brand/logo.svg";
import { cn } from "@utils/cn";
import { useEffect, useState } from "react";

interface BrandProps {
  className?: string;
}

export default function Brand({ className }: BrandProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const brandImage = new Image();
    brandImage.src = BrandSvg;

    const logoImage = new Image();
    logoImage.src = LogoSvg;

    [brandImage, logoImage].forEach((image) => {
      image.onload = () => {
        setLoaded(true);
      };
    });
  }, []);

  return (
    <Link
      to="/"
      className={cn("flex h-12 items-center justify-center gap-2", className)}
    >
      <div className="flex size-11 items-center justify-center rounded-tl-xl rounded-br-xl bg-blue-500 p-2">
        <img
          src={LogoSvg}
          alt="Logific"
          className={cn(
            "h-full w-auto object-contain invert",
            !loaded && "hidden",
          )}
        />
      </div>
      <div className="flex h-12 justify-center py-1.5">
        <img
          src={BrandSvg}
          alt="Logific"
          className={cn("h-full w-auto object-contain", !loaded && "hidden")}
        />
      </div>
    </Link>
  );
}
