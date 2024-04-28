import { Fragment, useEffect } from "react";
import { BannerCommon } from "../components/banner";
import LayoutProfile from "../layout/LayoutProfile";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FormAddress from "../module/Profile/address";
import { useAppSelector } from "../hook";
import { ChangePassword, ProfileInfo } from "../module/Profile";

function ProfilePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const user = useAppSelector((state) => state.authSlice.user);

  const redirectUrl = import.meta.env.VITE_DOMAIN_CLIENT + pathname;

  useEffect(() => {
    if (!user) {
      const query = encodeURIComponent(redirectUrl);
      navigate("/auth/login?next=" + query, { state: { path: pathname } });
    }
    if (!["address", "password", "profile"].includes(slug as string)) {
      navigate("/notfound/");
    }
  }, [navigate, pathname, redirectUrl, slug, user]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const selectForm = (slug: string | undefined) => {
    switch (slug) {
      case "address":
        return <FormAddress></FormAddress>;

      case "password":
        return <ChangePassword></ChangePassword>;

      case "profile":
        return <ProfileInfo slug={slug}></ProfileInfo>;

      default:
        break;
    }
  };

  return (
    <Fragment>
      <BannerCommon
        heading="Quản lí tài khoản"
        title="Tài khoản"
      ></BannerCommon>
      <LayoutProfile className="flex my-10 gap-x-5 min-h-[500px]">
        {selectForm(slug)}
      </LayoutProfile>
    </Fragment>
  );
}

export default ProfilePage;
