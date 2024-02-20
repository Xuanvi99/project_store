import CardItem from "../card";

function ProductLoadMore({ name = "sale" }: { name: string }) {
  return (
    <div className="w-full grid grid-cols-4 gap-3">
      {Array(10)
        .fill(null)
        .map((_, index) => {
          return (
            <CardItem
              key={index}
              type={name === "sale" ? "sale" : "normal"}
            ></CardItem>
          );
        })}
    </div>
  );
}

export default ProductLoadMore;
