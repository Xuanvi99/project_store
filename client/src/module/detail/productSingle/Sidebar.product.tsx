function Sidebar() {
  return (
    <div className="max-w-[280px] w-full">
      <div className="flex flex-col border-[1px] border-grayCa rounded p-5">
        <div className="flex items-center justify-center pb-5 font-bold gap-x-2 border-b-[1px] border-grayCa">
          <img src="" alt="" srcSet="/logo.png" />
          <span>XV Store</span>
        </div>
        <div className="flex flex-col justify-start mt-5 text-xs gap-y-2">
          <div className="flex items-center justify-start gap-x-1">
            <img alt="" srcSet="/hoan-tien.png" className="w-8 h-8" />
            <span>
              Hoàn tiền <p className="inline font-bold">100%</p> nếu không đúng
              hàng
            </span>
          </div>
          <div className="flex items-center justify-start gap-x-1">
            <img alt="" srcSet="/unbox.png" className="w-8 h-8" />
            <span>Nhận hàng Kiểm tra hàng Thoải mái</span>
          </div>
          <div className="flex items-center justify-start gap-x-1">
            <img alt="" srcSet="/doi-tra.png" className="w-8 h-8" />
            <span>
              Đổi trả trong <p className="inline font-bold">3</p> ngày nếu sp
              lỗi
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col border-[1px] border-grayCa rounded p-5 mt-5 items-center gap-y-2">
        <p>Hotline liên hệ</p>
        <h1 className="text-2xl font-bold text-orange">XXXX.XXX.XXX</h1>
        <p className="text-sm">(Zalo, 7h30 – 21h cả T7, CN)</p>
      </div>
    </div>
  );
}

export default Sidebar;
