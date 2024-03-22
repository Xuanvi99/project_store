import { Comment, Header, Navbar, Product } from "../module/dashboard";
import { useParams } from "react-router-dom";

function DashboardPage() {
  const { slug } = useParams();
  console.log("slug: ", slug);

  const Content = (slug: string | undefined) => {
    switch (slug) {
      case "product":
        return <Product></Product>;

      case "comment":
        return <Comment></Comment>;

      default:
        break;
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
