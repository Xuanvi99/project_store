import Cookies from "js-cookie";

export const getToken = () => {
  const refresh_token = Cookies.get("refreshToken");
  return refresh_token;
};
