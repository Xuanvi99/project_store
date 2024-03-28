import { useEffect } from "react";
import {
  Comment,
  Dashboard,
  Header,
  Navbar,
  Product,
} from "../module/dashboard";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../hook";

function DashboardPage() {
  const { slug } = useParams();
  console.log("slug: ", slug);

  const navigate = useNavigate();
  const user = useAppSelector((state) => state.authSlice.user);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login", { replace: true });
    } else {
      if (user.role !== "admin") {
        navigate("/", { replace: true });
      }
    }
  }, [navigate, user]);

  const Content = (slug: string | undefined) => {
    switch (slug) {
      case "product":
        return <Product></Product>;

      case "comment":
        return <Comment></Comment>;

      default:
        return <Dashboard></Dashboard>;
    }
  };
  return (
    <div className="w-full min-h-screen max-w-screen-2xl bg-stone-200 ">
      <Header></Header>
      <div className="flex min-h-[calc(100vh-50px)]">
        <Navbar></Navbar>
        {Content(slug)}
      </div>
    </div>
  );
}

export default DashboardPage;
