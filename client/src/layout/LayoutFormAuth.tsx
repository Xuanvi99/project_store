import { Link } from "react-router-dom";
import { cn } from "../utils";

type TProps = {
  children: React.ReactNode;
  title: string;
  className?: string;
};

function LayoutFormAuth({ children, title, className }: TProps) {
  return (
    <section className="w-full">
      <div className="w-full h-[80px] shadow-[0_10px_25px_rgba(0,0,0,0.2)]">
        <div className="w-[1200px] h-full mx-auto gap-x-8 flex items-center">
          <Link to={"/"} className="flex items-center cursor-pointer gap-x-2">
            <img alt="" srcSet="/logo.png" loading="lazy" />
            <span className="text-xl font-bold whitespace-nowrap text-orange">
              XVStore
            </span>
          </Link>
          <span className="text-2xl text-grayDark">{title}</span>
        </div>
      </div>
      <main className={cn(`w-full min-h-[500px]`, className)}>{children}</main>
    </section>
  );
}

export default LayoutFormAuth;
