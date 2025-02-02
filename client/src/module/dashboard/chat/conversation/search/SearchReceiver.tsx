import { IUser } from "@/types/user.type";
import { cn } from "@/utils";
import { useEffect, useRef, useState } from "react";
import SearchItem from "./SearchItem";

type TProps = {
  receiver: IUser[];
};
function SearchReceiver({ receiver }: TProps) {
  const receiverRef = useRef<HTMLDivElement>(null);

  const [openScroll, setOpenScroll] = useState<boolean>(false);

  useEffect(() => {
    if (receiverRef.current && receiver) {
      const height = receiverRef.current.offsetHeight;
      setOpenScroll(height / 70 < receiver.length ? true : false);
    }
  }, [receiver]);

  return (
    <div
      ref={receiverRef}
      className={cn(
        "w-full h-full flex flex-col mt-auto ",
        openScroll && "overflow-y-scroll"
      )}
    >
      {receiver.map((user) => (
        <SearchItem key={user._id} user={user}></SearchItem>
      ))}
    </div>
  );
}

export default SearchReceiver;
