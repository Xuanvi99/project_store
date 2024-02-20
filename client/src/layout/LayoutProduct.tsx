import { cn } from "../utils";

function LayoutProduct({ children }: { children: React.ReactNode }) {
  return (
    <section
      className={cn(
        "w-full max-w-[1200px] rounded-md px-[15px] py-5 bg-white mx-auto shadow-sm shadow-grayDark my-5"
      )}
    >
      {children}
    </section>
  );
}

export default LayoutProduct;
