import { Fragment } from "react";
import { BannerCommon } from "../components/banner";
import LayoutProfile from "../layout/LayoutProfile";
import FormInfoUser from "../module/Profile/infoUser";
import { useParams } from "react-router-dom";
import FormAddress from "../module/Profile/address";
import FormChangePassword from "../module/Profile/password";

function ProfilePage() {
  const { slug } = useParams();
  return (
    <Fragment>
      <BannerCommon
        heading="Quản lí tài khoản"
        title="Tài khoản"
      ></BannerCommon>
      <LayoutProfile className="flex my-10 gap-x-5">
        {slug === "profile" && <FormInfoUser></FormInfoUser>}
        {slug === "address" && <FormAddress></FormAddress>}
        {slug === "password" && <FormChangePassword></FormChangePassword>}
      </LayoutProfile>
    </Fragment>
  );
}

export default ProfilePage;
