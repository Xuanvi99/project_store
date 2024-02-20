import CardHeading from "./CardHeading";
import CardImage from "./CardImage";
import CardInfo from "./CardInfo";
import CardSales from "./CardSales";

interface ICardItemProps {
  type: "sale" | "normal";
}

function CardItem({ type }: ICardItemProps) {
  return (
    <div className="relative card-item ">
      <CardSales discount="50%" type={type}></CardSales>
      <div className="flex flex-col">
        <CardImage src="/shoes.jpg" path="/productDetail"></CardImage>
        <div className="bg-[#f8f9fa] flex flex-col flex-1 text-sm gap-y-2 p-[10px]">
          <CardHeading
            title=" Giày Nike Air Jordan 1"
            path="/productDetail"
          ></CardHeading>
          <CardInfo title="Giá">
            <span className="line-through ">1.000.000₫</span>
            <span className="text-red-600">800.000₫</span>
          </CardInfo>
          <CardInfo title="Đã bán">
            <span>111</span>
          </CardInfo>
        </div>
      </div>
    </div>
  );
}

export default CardItem;
