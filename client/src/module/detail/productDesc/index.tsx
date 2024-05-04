import { IconChevronRight } from "@/components/icon";
import { cn } from "@/utils";
import { useState } from "react";

function ProductDesc() {
  const [heightDesc, setHeightDesc] = useState<string>("200px");
  const [openDesc, setOpenDesc] = useState(true);
  return (
    <section className="w-full mt-5 bg-white rounded-md py-5 px-[10px]">
      <h1 className="text-lg font-bold">MÔ TẢ SẢN PHẨM</h1>
      <div
        style={{ height: heightDesc }}
        className="relative w-full mt-5 overflow-hidden"
      >
        <p className="px-5">
          Cái khát vọng cùng được hòa nhập tâm hồn, được sống trong anh cứ quấn
          quýt, ràng buộc với em. Sự khát vọng hòa nhập tình yêu ấy được tác giả
          nâng lên tầm cao vũ trụ. Như vầng trăng lặn sâu vào biển cả, đại dương
          với muôn ngàn con sóng yêu thương, rì rào vô tận. Trăng như ghì lấy
          đại dương, dù rất nhỏ bé nhưng sức lay động kết dính thật kì diệu. Như
          cái trăn trở của đôi lứa yêu nhau không chỉ là những trách móc, hờn
          ghen, những băn khoăn ấy dường như có sự nghịch lí lạ lùng. Anh không
          giấu em một điều gì Chính vì thế mà em không biết gì tất cả về anh.
          Chính vì quá yêu em, yêu em mãnh liệt mà em nghi ngờ anh. Cái nghịch
          lí này phải chăng chỉ có ở tình yêu? Làm thế nào để em hiểu anh đây?
          Đọc câu thơ trên ta hình dung ra ngay người con trai đang thì thầm tâm
          sự. Tình yêu có ngôn ngữ riêng của nó. Dẫu em không nói ra nhưng anh
          cũng đọc được ở đáy mắt em một đôi lời thì thầm. Ánh mắt ấy như rực
          sáng trong anh một ngọn lửa khát vọng yêu đương, hòa hợp tâm hồn. Anh
          sẽ là biển cả trùng dương cơn sóng vỗ, ru hồn mảnh trăng bằng đợt sóng
          ngân nga, êm dịu như để phơi bày cả tâm hồn mình cho người yêu. Nhân
          vật anh trữ tình ví mình như viên ngọc, đóa hoa và khát vọng được dâng
          tặng cho Nữ thần Tình yêu, vị giáo chủ nhỏ bé của mình: Nếu đời anh
          chỉ là viên ngọc Anh sẽ đập nó ra làm trăm mảnh Và xâu thành một chuỗi
          quàng vào cổ em. Nếu đời anh chỉ là một đóa hoa Tròn trịa, dịu dàng và
          bé bỏng Anh sẽ hái nó ra để đặt lên mái tóc em. Anh nguyện là người
          của riêng em. Từ chỉ ở đây như xưng tôn giá trị của viên ngọc, của đóa
          hoa. Em là tác phẩm quý đẹp của Thượng đế nên anh xin làm ngọc được
          quàng vào cổ em, được là đóa hoa cài lên mái tóc như suối mây ấy, được
          điểm trang em lên và em tuyệt vời hơn. Đó là ước mơ khao khát trong
          trái tim anh. Có lẽ chỉ có đôi lứa yêu nhau, yêu nhau với tình yêu
          cháy bỏng, chân thành mới có được những lời thì thầm chân thành ấy.
          Nét tâm lí chung chăng? Ta có lần bắt gặp trong lời hát của Trịnh Công
          Sơn: Anh xin làm quán trọ để dừng chân, em ghé chơi Anh xin làm đá
          cuội và lăn theo gót hài.
        </p>
        {openDesc && (
          <div
            onClick={() => {
              setHeightDesc("auto");
              setOpenDesc(false);
            }}
            className={cn(
              "flex items-center justify-center absolute left-0 bottom-0 bg-white z-30 w-full h-16 ",
              "before:absolute before:h-14 before:w-full before:bg-whiteLinear before:bottom-full before:left-0 "
            )}
          >
            <button className="text-lg relative text-gray w-[100px] h-full flex items-end justify-center">
              <span className="absolute rotate-90 -translate-x-1/2 arrow-top left-1/2">
                <IconChevronRight size={25}></IconChevronRight>
              </span>
              <span className="absolute rotate-90 -translate-x-1/2 arrow-bottom left-1/2">
                <IconChevronRight size={25}></IconChevronRight>
              </span>
              <span className="hover:text-orange">Xem tiếp</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductDesc;
