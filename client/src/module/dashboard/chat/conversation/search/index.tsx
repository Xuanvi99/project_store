import { IconSearch, IconBack } from "@/components/icon";
import { Input } from "@/components/input";
import { cn } from "@/utils";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useLazyGetUsersChatQuery } from "@/stores/service/chat.service";
import { IUser } from "@/types/user.type";
import { toast } from "react-toastify";
import SearchReceiver from "./SearchReceiver";
import useChatContext from "../../context/useChatContext";
import { debounce } from "lodash";

function ConversationSearch() {
  const { openSearchResult, handleOpenSearchResult } = useChatContext();

  const [getUsersChat] = useLazyGetUsersChatQuery();

  const [textSearch, setTextSearch] = useState<string>("");

  const [usersChat, setUsersChat] = useState<IUser[]>([]);

  const HandleSearch = useMemo(
    () => async (value: string) => {
      await getUsersChat(value)
        .unwrap()
        .then((res) => {
          console.log("res: ", res);
          setUsersChat(res);
        })
        .catch(() => {
          toast("Lỗi request data");
        });
    },
    [getUsersChat]
  );

  const debounceFn = useMemo(() => debounce(HandleSearch, 500), [HandleSearch]);

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
    if (event.target.value.length === 0) {
      setUsersChat([]);
    } else {
      debounceFn(event.target.value);
    }
  };

  useEffect(() => {
    if (!openSearchResult) {
      setTextSearch("");
      setUsersChat([]);
    }
  }, [openSearchResult]);

  return (
    <Fragment>
      <div className="flex items-center gap-x-3 w-full">
        {openSearchResult && (
          <div
            onClick={() => {
              handleOpenSearchResult(false);
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-orange cursor-pointer hover:bg-orange hover:text-white"
          >
            <IconBack size={50}></IconBack>
          </div>
        )}
        <div
          className={cn(
            "px-2 flex rounded-xl bg-grayF5 border-1 border-orange items-center",
            !openSearchResult && "w-full"
          )}
        >
          <IconSearch size={28}></IconSearch>
          <Input
            type="text"
            name="search"
            id="search"
            value={textSearch}
            onChange={(event) => handleChangeSearch(event)}
            placeholder="Tìm kiếm..."
            autoComplete="false"
            onFocus={() => {
              handleOpenSearchResult(true);
            }}
            className={{
              input:
                "w-full px-[10px] bg-grayF5 outline-none py-2 border-none text-lg",
            }}
          />
        </div>
      </div>
      {openSearchResult && (
        <SearchReceiver receiver={usersChat}></SearchReceiver>
      )}
    </Fragment>
  );
}

export default ConversationSearch;
