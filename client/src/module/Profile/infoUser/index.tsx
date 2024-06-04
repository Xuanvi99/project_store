import { useParams } from "react-router-dom";
import { FormEmail, FormInfoUser } from "..";
import FormPhone from "./phone";

function ProfileInfo() {
  const { slug } = useParams();
  const selectForm = (slug: string | undefined) => {
    switch (slug) {
      case "email":
        return <FormEmail></FormEmail>;
      case "phone":
        return <FormPhone></FormPhone>;
      default:
        return <FormInfoUser></FormInfoUser>;
    }
  };

  return <>{selectForm(slug)}</>;
}

export default ProfileInfo;
