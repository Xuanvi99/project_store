import Card from "../card";

function ProductLoadMore({ name }: { name: string }) {
  return (
    <div className="w-full grid grid-cols-4 gap-3">
      {/* {Array(10)
        .fill(null)
        .map((_, index) => {
          return (
            <Card key={index} type={name === "sale" ? "sale" : "normal"}></Card>
          );
        })} */}
    </div>
  );
}

export default ProductLoadMore;
