import { Link } from "react-router-dom";

export default function Heading({
  title,
  path,
}: {
  title: string;
  path: string;
}) {
  return (
    <Link
      to={path}
      className="font-bold text-black min-h-[40px] cursor-pointer line-clamp-2 hover:text-blue"
    >
      {title}
    </Link>
  );
}
