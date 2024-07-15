import { useEffect, useLayoutEffect } from "react";
import LayoutProfile from "../layout/LayoutProfile";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FormAddress from "../module/profile/address";
import { useAppSelector } from "../hook";
import { ChangePassword, ProfileInfo } from "../module/profile";
import { RootState } from "@/stores";
import PurchaseOrder from "@/module/profile/purchaseOrder";

function ProfilePage() {
  const { slug } = useParams();
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const redirectUrl = import.meta.env.VITE_DOMAIN_CLIENT + pathname;

  useLayoutEffect(() => {
    if (!user) {
      const query = encodeURIComponent(redirectUrl);
      navigate("/auth/login?next=" + query, { state: { path: pathname } });
    } else if (
      ![
        "address",
        "password",
        "profile",
        "purchaseOrder",
        "email",
        "phone",
      ].includes(slug as string)
    ) {
      navigate("/user/account/profile");
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

      case "purchaseOrder":
        return <PurchaseOrder></PurchaseOrder>;

      default:
        return <ProfileInfo></ProfileInfo>;
    }
  };

  return (
    <LayoutProfile className="flex my-10 gap-x-5 min-h-[500px]">
      {selectForm(slug)}
    </LayoutProfile>
  );
}

export default ProfilePage;
