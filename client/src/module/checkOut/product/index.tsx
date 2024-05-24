function ListProductOrder() {
  return (
    <section className="w-full mx-auto mt-5 px-[30px] shadow-sm shadow-grayCa  bg-white rounded-[3px] flex flex-col justify-between items-center">
      <div className="flex items-center w-full py-5 font-bold">
        <div className="w-1/2">Sản phẩm</div>
        <div className="grid w-1/2 grid-cols-3 text-sm text-center text-gray gap-x-5">
          <span>Đơn giá</span>
          <span>Số lượng</span>
          <span>Thành tiền</span>
        </div>
      </div>
      <div className="flex flex-col w-full border-dashed gap-y-2 border-t-1 border-grayCa">
        <div className="flex items-center w-full py-5">
          <div className="flex items-center w-1/2 text-sm font-normal gap-x-2">
            <img alt="" srcSet="/shoes.jpg" className="max-w-[80px] w-full" />
            <span className="line-clamp-1">
              Giày Nike Air Jordan 1 Low Panda Like Auth
            </span>
          </div>
          <div className="grid w-1/2 grid-cols-3 text-sm text-center text-gray gap-x-5">
            <span>Đơn giá</span>
            <span>Số lượng</span>
            <span>Thành tiền</span>
          </div>
        </div>
        <div className="flex items-center w-full py-5">
          <div className="flex items-center w-1/2 text-sm font-normal gap-x-2">
            <img alt="" srcSet="/shoes.jpg" className="w-[80px]" />
            <span className="line-clamp-1">
              Giày Nike Air Jordan 1 Low Panda Like Auth
            </span>
          </div>
          <div className="grid w-1/2 grid-cols-3 text-sm text-center text-gray gap-x-5">
            <span>Đơn giá</span>
            <span>Số lượng</span>
            <span>Thành tiền</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ListProductOrder;
