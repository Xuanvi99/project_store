import { LazyLoadImage } from "react-lazy-load-image-component";

export default function Thumbnails({ src }: { src: string }) {
  return (
    <div className="w-full min-h-[250px] overflow-hidden cursor-pointer">
      <LazyLoadImage
        alt="Thumbnails"
        placeholderSrc={src}
        srcSet={src}
        effect="blur"
        className="hover:scale-[1.1] duration-500"
      />
    </div>
  );
}
