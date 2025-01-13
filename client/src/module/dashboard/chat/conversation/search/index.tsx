import { IconSearch } from "@/components/icon";
import { Input } from "@/components/input";
import { cn } from "@/utils";
import { Fragment, useEffect, useState } from "react";
import { useLazyGetUsersChatQuery } from "@/stores/service/chat.service";
import { IUser } from "@/types/user.type";
import { toast } from "react-toastify";
import SearchReceiver from "./SearchReceiver";
import useChatContext from "../../context/useChatContext";

function ConversationSearch() {
  const { openSearchResult, handleOpenSearchResult } = useChatContext();

  const [getUsersChat] = useLazyGetUsersChatQuery();

  const [textSearch, setTextSearch] = useState<string>("");

  const [usersChat, setUsersChat] = useState<IUser[]>([]);

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
    if (event.target.value.length === 0) {
      setUsersChat([]);
    }
  };

  useEffect(() => {
    if (textSearch.length > 0) {
      const handleGetUsersChat = async () => {
        await getUsersChat(textSearch)
          .unwrap()
          .then((res) => {
            console.log("res: ", res);
            setUsersChat(res);
          })
          .catch(() => {
            toast("Lỗi request data");
          });
      };
      handleGetUsersChat();
    }
  }, [getUsersChat, textSearch]);

  useEffect(() => {
    if (!openSearchResult) {
      setTextSearch("");
      setUsersChat([]);
    }
  }, [openSearchResult]);

  return (
    <Fragment>
      <div
        className={cn(
          "w-full px-2 flex rounded-xl  bg-grayF5 border-1 border-orange items-center"
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
          onBlur={() => {
            if (textSearch.length === 0) {
              handleOpenSearchResult(false);
            }
          }}
          className={{
            input:
              "w-full px-[10px] bg-grayF5 outline-none py-2 border-none text-lg",
          }}
        />
      </div>
      {openSearchResult && (
        <SearchReceiver receiver={usersChat}></SearchReceiver>
      )}
    </Fragment>
  );
}

export default ConversationSearch;
