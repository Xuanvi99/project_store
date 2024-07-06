import { Fragment, useLayoutEffect } from "react";
import Header from "./headerOrder";
import { useNavigate, useParams } from "react-router-dom";
import DetailOrder from "./detaiOrder";
import HomeOrder from "./homeOrder";

function Order() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const selectPathOrderDashboard = (slug: string) => {
    switch (slug) {
      case "home":
        return <HomeOrder></HomeOrder>;

      case "detail":
        return <DetailOrder></DetailOrder>;

      default:
        break;
    }
  };

  useLayoutEffect(() => {
    if (!slug || (slug && !["home", "detail", "print"].includes(slug))) {
      navigate("*");
    }
  }, [navigate, slug]);

  if (!slug) return <></>;

  return (
    <Fragment>
      <Header></Header>
      {selectPathOrderDashboard(slug)}
    </Fragment>
  );
}

export default Order;
