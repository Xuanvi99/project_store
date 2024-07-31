import StatisticsOrder from "./StatisticsOrder.home";
import ListOrder from "../listOrder";
import { Fragment } from "react";
import HeaderOrder from "../header.order";

function HomeOrder() {
  return (
    <Fragment>
      <HeaderOrder></HeaderOrder>
      <div className="home-order px-6 mt-5">
        <StatisticsOrder></StatisticsOrder>
        <ListOrder></ListOrder>
      </div>
    </Fragment>
  );
}

export default HomeOrder;
