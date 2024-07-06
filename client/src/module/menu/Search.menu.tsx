import { Button } from "@/components/button";
import { IconSearch } from "@/components/icon";
import { Input } from "@/components/input";
import { cn } from "@/utils";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

type TProps = {
  className?: string;
};

function Search({ className }: TProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [textSearch, setTextSearch] = useState<string>(
    searchParams.get("s") || ""
  );

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };

  const handleSubmitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/search?s=${textSearch}&page=1`, {
      state: { s: textSearch },
    });
  };

  return (
    <form
      onSubmit={(event) => handleSubmitSearch(event)}
      className={cn(
        "w-[550px] p-[3px] flex rounded-[3px] bg-white border-[1px] border-orange items-center flex-shrink-1",
        className
      )}
    >
      <Input
        type="text"
        name="search"
        id="search"
        value={textSearch}
        onChange={(event) => handleChangeSearch(event)}
        placeholder="Tìm kiếm nhanh sản phẩm...?"
        className={{
          input: "w-full px-[10px] outline-none text-sm py-2 border-none",
        }}
      />
      <Button variant="default" type="submit" className="px-5 py-2 text-white">
        <IconSearch size={20}></IconSearch>
      </Button>
    </form>
  );
}

export default Search;
