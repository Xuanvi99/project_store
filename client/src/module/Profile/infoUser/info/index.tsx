import { Fragment, useEffect } from "react";
import FormUpdateInfo from "./FormUpdateInfo";
import { useAppDispatch, useAppSelector } from "@/hook";
import { useGetProfileQuery } from "@/stores/service/user.service";
import { updateAuth } from "@/stores/reducer/authReducer";
import Heading from "../../common/Heading";
import { RootState } from "@/stores";
import EditAvatar from "./EditAvatar";

function FormInfoUser() {
  const user = useAppSelector((state: RootState) => state.authSlice.user);
  const dispatch = useAppDispatch();

  const id = user ? user._id : "";
  const { data, status } = useGetProfileQuery(id, { skip: !id });

  useEffect(() => {
    if (data && status === "fulfilled") {
      dispatch(updateAuth({ user: data.user }));
    }
  }, [data, dispatch, status]);

  return (
    <Fragment>
      <section className="max-w-[1000px] w-full bg-white rounded px-8">
        <Heading className="flex flex-col items-start justify-center">
          <h1 className="text-lg font-medium">Hồ Sơ Của Bạn</h1>
          <p className="mt-1 text-sm text-gray">
            Quản lý thông tin hồ sơ để bảo mật tài khoản
          </p>
        </Heading>
        <div className="flex py-[30px]">
          <FormUpdateInfo></FormUpdateInfo>
          <EditAvatar></EditAvatar>
        </div>
      </section>
    </Fragment>
  );
}

export default FormInfoUser;
