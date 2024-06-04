import AllPurchase from "./AllPurchase";
import Cancelled from "./Cancelled";
import Completed from "./Completed";
import Delivery from "./Delivery";
import ReturnAndRefund from "./ReturnAndRefund";
import TransportOrder from "./TransportOrder";

function ContentPurchase({ type }: { type: number }) {
  const handleSelectContent = () => {
    switch (type) {
      case 2:
        return <TransportOrder></TransportOrder>;

      case 3:
        return <Delivery></Delivery>;

      case 4:
        return <Completed></Completed>;

      case 5:
        return <Cancelled></Cancelled>;

      case 6:
        return <ReturnAndRefund></ReturnAndRefund>;

      default:
        return <AllPurchase></AllPurchase>;
    }
  };
  return (
    <div className="w-full mt-5 bg-white rounded-sm">
      {handleSelectContent()}
    </div>
  );
}

export default ContentPurchase;
