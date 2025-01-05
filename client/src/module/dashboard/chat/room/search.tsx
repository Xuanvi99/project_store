import { IconSearch } from "@/components/icon";
import { Input } from "@/components/input";
import { cn } from "@/utils";
import { useState } from "react";

function SearchRoom() {
  const [textSearch, setTextSearch] = useState<string>("");

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };

  const handleSubmitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form
      onSubmit={(event) => handleSubmitSearch(event)}
      className={cn(
        "w-full px-2 flex rounded-md bg-grayF5 border-1 border-orange items-center flex-shrink-1"
      )}
    >
      <IconSearch size={20}></IconSearch>
      <Input
        type="text"
        name="search"
        id="search"
        value={textSearch}
        onChange={(event) => handleChangeSearch(event)}
        placeholder="Tìm kiếm..."
        autoComplete="false"
        className={{
          input:
            "w-full px-[10px] bg-grayF5 outline-none text-sm py-2 border-none",
        }}
      />
    </form>
  );
}

export default SearchRoom;
