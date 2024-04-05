import { useParams } from "react-router-dom";
import LayoutFormAuth from "../layout/LayoutFormAuth";
import VerifyOtp from "../module/verify/otp";
import VerifyChangePw from "../module/verify/password";
import { useEffect, useState } from "react";

function VerifyPage() {
  const { slug } = useParams();
  const [title, setTitle] = useState<string>("error");

  useEffect(() => {
    if (slug) {
      switch (slug) {
        case "otp":
          setTitle("Xác minh OTP");
          break;

        case "pw":
          setTitle("Xác minh tài khoản");
          break;

        default:
          break;
      }
    }
  }, [slug]);

  const selectComponent = (slug: string | undefined) => {
    switch (slug) {
      case "otp":
        return <VerifyOtp></VerifyOtp>;
      case "pw":
        return <VerifyChangePw></VerifyChangePw>;

      default:
        break;
    }
  };

  return (
    <LayoutFormAuth title={title} className="flex items-center justify-center">
      {selectComponent(slug)}
    </LayoutFormAuth>
  );
}

export default VerifyPage;
