import { Button } from ".";
import { cn } from "../../utils";
import { useGoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../../hook";
import { updateAuth } from "../../stores/reducer/authReducer";
import { useNavigate } from "react-router-dom";
import {
  useLazyGetInfoAuthGoogleQuery,
  useLoginAuthGoogleMutation,
} from "@/stores/service/authGoogle.service";

type TProps = {
  text: string;
  className?: {
    wrap?: string;
    btn?: string;
  };
  pathname: string;
  onClick?: () => void;
  handleErrorLogin?: (errorStatus: number) => void;
};

function ButtonGoogle({ text, className, pathname, handleErrorLogin }: TProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [getInfoAuthGoogle] = useLazyGetInfoAuthGoogleQuery();

  const [loginAuthGoogle] = useLoginAuthGoogleMutation();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await getInfoAuthGoogle(tokenResponse.access_token)
          .unwrap()
          .then(async (res) => {
            await loginAuthGoogle(res)
              .unwrap()
              .then((res) => {
                dispatch(updateAuth({ ...res, isLogin: true }));
                navigate(pathname, { replace: true });
              })
              .catch((error) => {
                if (handleErrorLogin) handleErrorLogin(error.status);
              });
          })
          .catch((error) => {
            throw new Error(error);
          });
      } catch (error) {
        console.log("error: ", error);
        if (handleErrorLogin) handleErrorLogin(400);
      }
    },
  });
  return (
    <div
      onClick={() => login()}
      className={cn("flex justify-center pt-5", className?.wrap)}
    >
      <Button type="button" variant="outLine-flex" className={className?.btn}>
        <img alt="" loading="lazy" srcSet="/google.png" className="w-7" />
        <span className="text-xs">{text}</span>
      </Button>
    </div>
  );
}

export default ButtonGoogle;
