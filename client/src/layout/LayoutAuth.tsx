import { GoogleOAuthProvider } from "@react-oauth/google";
const { VITE_GOOGLE_CLIENT_ID } = import.meta.env;
type TProps = {
  children: React.ReactNode;
};
function LayoutAuth({ children }: TProps) {
  return (
    <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
      <section className="w-full min-h-[600px] bg-orangeLinear flex justify-center items-center">
        <div className="w-[900px] h-[550px] flex rounded-xl shadow-lg shadow-black overflow-hidden">
          <div className="w-1/2 h-full rounded-l-xl">
            <img
              alt=""
              loading="lazy"
              srcSet="/imageLogin.png"
              className="w-full h-full"
            />
          </div>
          <div className="w-1/2 h-full bg-white">{children}</div>
        </div>
      </section>
    </GoogleOAuthProvider>
  );
}

export default LayoutAuth;
