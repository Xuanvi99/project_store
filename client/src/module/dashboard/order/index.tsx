import { Fragment, useEffect, useLayoutEffect } from "react";
import Header from "./headerOrder";
import { useNavigate, useParams } from "react-router-dom";
import OrderDetail from "./orderDetail";
import HomeOrder from "./homeOrder";

function Order() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const selectPathOrderDashboard = (slug: string) => {
    switch (slug) {
      case "home":
        return <HomeOrder></HomeOrder>;

      case "detail":
        return <OrderDetail></OrderDetail>;

      default:
        break;
    }
  };

  useLayoutEffect(() => {
    if (!slug || (slug && !["home", "detail", "print"].includes(slug))) {
      navigate("*");
    }
  }, [navigate, slug]);

  useEffect(() => {
    if (slug) {
      window.scrollTo({ top: 0 });
    }
  }, [slug]);

  if (!slug) return <></>;

  return (
    <Fragment>
      <Header></Header>
      <div className="px-6 mt-5">{selectPathOrderDashboard(slug)}</div>
    </Fragment>
  );
}

export default Order;
