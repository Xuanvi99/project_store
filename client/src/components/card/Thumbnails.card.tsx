import { Link } from "react-router-dom";

export default function Thumbnails({
  src,
  path,
}: {
  src: string;
  path: string;
}) {
  return (
    <Link
      to={path}
      className="w-full  min-h-[200px] overflow-hidden cursor-pointer"
    >
      <img
        alt=""
        srcSet={src}
        loading="lazy"
        title="abc"
        className="hover:scale-[1.1] duration-500"
      />
    </Link>
  );
}
