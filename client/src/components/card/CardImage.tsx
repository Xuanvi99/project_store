import { Link } from "react-router-dom";

export default function CardImage({
  src,
  path,
}: {
  src: string;
  path: string;
}) {
  return (
    <Link to={path} className="w-full overflow-hidden cursor-pointer">
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
