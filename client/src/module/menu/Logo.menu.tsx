import { cn } from "@/utils";
import { Link } from "react-router-dom";

function Logo({
  className,
  image,
}: {
  className?: string;
  image?: {
    src?: string;
    cn?: string;
  };
}) {
  return (
    <Link
      to={"/"}
      className={cn(
        "flex items-center cursor-pointer gap-x-2 text-xl font-bold text-orange",
        className
      )}
    >
      <img
        alt=""
        srcSet="/logo.png"
        loading="lazy"
        className={image?.cn || ""}
      />
      <span className=" whitespace-nowrap">XVStore</span>
    </Link>
  );
}

export default Logo;
