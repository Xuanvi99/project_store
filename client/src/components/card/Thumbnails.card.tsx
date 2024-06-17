import { LazyLoadImage } from "react-lazy-load-image-component";
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
      className="w-full min-h-[250px] overflow-hidden cursor-pointer"
    >
      <LazyLoadImage
        alt="Thumbnails"
        placeholderSrc={src}
        srcSet={src}
        effect="blur"
        className="hover:scale-[1.1] duration-500"
      />
    </Link>
  );
}
