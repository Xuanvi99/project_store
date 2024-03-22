import axios from "axios";
import { Button } from ".";
import { cn } from "../../utils";
import { useGoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../../hook";
import { updateAuth } from "../../stores/reducer/authReducer";
import { useNavigate } from "react-router-dom";

type TProps = {
  text: string;
  className?: {
    wrap?: string;
    btn?: string;
  };
  redirectUrl: string;
  onClick?: () => void;
};

function ButtonGoogle({ text, className, redirectUrl }: TProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const responsive = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: "Bearer " + tokenResponse.access_token,
            },
          }
        );
        if (responsive.data) {
          const res = await axios({
            method: "POST",
            url: "http://localhost:3000/api/auth/loginGoogle",
            data: { ...responsive.data },
            withCredentials: true,
          });
          if (res.data) {
            dispatch(updateAuth({ ...res.data, isLogin: true }));
            if (redirectUrl === "/") {
              navigate("/");
            } else {
              window.location.href = redirectUrl;
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
    <div
      onClick={() => login()}
      className={cn("flex justify-center pt-5", className?.wrap)}
    >
      <Button type="button" variant="outLine-flex" className={className?.btn}>
        <img alt="" srcSet="/google.png" className="w-7" />
        <span className="text-xs">{text}</span>
      </Button>
    </div>
  );
}

export default ButtonGoogle;
