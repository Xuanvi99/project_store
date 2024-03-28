import { useAppSelector } from "../../../../hook";
import Heading from "../../common/Heading";
function FormEmail() {
  const user = useAppSelector((state) => state.authSlice.user);
  return (
    <section className="max-w-[1000px] w-full bg-white rounded px-8">
      <Heading
        title={user?.email ? "Thay đổi địa chỉ email" : "Thêm địa chỉ email"}
        className="flex flex-col items-start justify-center"
      />
      <div></div>
    </section>
  );
}

export default FormEmail;
