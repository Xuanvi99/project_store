import { IconSearch, IconBack } from "@/components/icon";
import { Input } from "@/components/input";
import { cn } from "@/utils";
import { Fragment, useLayoutEffect, useMemo, useState } from "react";
import { useLazyGetUsersChatQuery } from "@/stores/service/chat.service";
import { IUser } from "@/types/user.type";
import { toast } from "react-toastify";
import SearchReceiver from "./SearchReceiver";
import { debounce } from "lodash";
import LoadingSpinner from "@/components/loading";

type TPropsSearch = {
  openSearchResult: boolean;
  handleOpenSearchResult: (status: boolean) => void;
};
function ConversationSearch({
  openSearchResult,
  handleOpenSearchResult,
}: TPropsSearch) {
  const [getUsersChat, { isFetching }] = useLazyGetUsersChatQuery();

  const [textSearch, setTextSearch] = useState<string>("");

  const [usersChat, setUsersChat] = useState<IUser[]>([]);

  const HandleSearch = useMemo(
    () => async (value: string) => {
      await getUsersChat(value)
        .unwrap()
        .then((res) => {
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
    debounceFn(event.target.value);
  };

  useLayoutEffect(() => {
    if (!openSearchResult) {
      setTextSearch("");
      setUsersChat([]);
    }
  }, [openSearchResult]);

  return (
    <Fragment>
      <div className="flex items-center w-full gap-x-3">
        {openSearchResult && (
          <div
            onClick={() => {
              handleOpenSearchResult(false);
            }}
            className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer text-orange hover:bg-orange hover:text-white"
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
              debounceFn("");
            }}
            className={{
              input:
                "w-full px-[10px] bg-grayF5 outline-none py-2 border-none text-lg",
            }}
          />
        </div>
      </div>

      {openSearchResult && (
        <div className="m-2 text-sm font-semibold">Kết quả tìm kiếm:</div>
      )}
      {openSearchResult && isFetching && (
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner></LoadingSpinner>
        </div>
      )}
      {openSearchResult && !isFetching && usersChat.length > 0 && (
        <SearchReceiver
          receiver={usersChat}
          handleOpenSearchResult={handleOpenSearchResult}
        />
      )}
    </Fragment>
  );
}

export default ConversationSearch;
