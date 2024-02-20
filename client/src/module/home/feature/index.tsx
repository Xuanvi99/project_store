import { Link } from "react-router-dom";
import { listFeature } from "../../../constant/home.constant";
import { cn } from "../../../utils";

function Feature() {
  return (
    <section className="features-area w-full max-w-[1200px] px-[30px] bg-white p-4 mx-auto mt-10  rounded-md">
      <div className="container flex justify-between">
        {listFeature &&
          listFeature.length > 0 &&
          listFeature.map((item) => {
            return <FeatureItem key={item.title} data={item}></FeatureItem>;
          })}
      </div>
    </section>
  );
}

interface IFeatureItemProps {
  data: { title: string; image: string; path: string };
}

const FeatureItem = ({ data }: IFeatureItemProps) => {
  const { title, image, path } = data;
  return (
    <Link
      to={path}
      className={cn(
        "flex flex-col items-center justify-between gap-y-[5px] overflow-hidden duration-300",
        "hover:scale-110 hover:text-blue"
      )}
    >
      <img
        alt=""
        srcSet={image}
        className="w-[80px] h-[80px] rounded-full object-cover"
      />
      <p className="text-sm font-bold">{title}</p>
    </Link>
  );
};

export default Feature;
