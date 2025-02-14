import { useGetProfileQuery } from "@/stores/service/user.service";
import { IUser } from "@/types/user.type";
import { useEffect, useState } from "react";

function useGetProfile(id: string) {
  const [receiver, setReceiver] = useState<IUser>();

  const { data, status } = useGetProfileQuery(id, { skip: !id });

  useEffect(() => {
    if (data && status === "fulfilled") {
      setReceiver(data.user);
    }
  }, [data, status]);

  return receiver;
}

export default useGetProfile;
