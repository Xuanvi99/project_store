import { Button } from "../../components/button";
import { IconSearch } from "../../components/icon";
import { Input } from "../../components/input";

type TProps = {
  valueInput: string;
  onSubmitSearch: (event: React.FormEvent<HTMLFormElement>) => void;
  onChangeSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function Search({ valueInput, onSubmitSearch, onChangeSearch }: TProps) {
  return (
    <form
      onSubmit={(event) => onSubmitSearch(event)}
      className="w-[550px] p-[3px] flex rounded-[3px] bg-white border-[1px] border-orange items-center flex-shrink-1"
    >
      <Input
        type="text"
        name="search"
        id="search"
        value={valueInput}
        onChange={(event) => onChangeSearch(event)}
        placeholder="Tìm kiếm nhanh sản phẩm...?"
        className={{
          input: "w-full px-[10px] outline-none text-sm py-2 border-none",
        }}
      />
      <Button variant="default" type="submit" className="px-5 py-2 ">
        <IconSearch></IconSearch>
      </Button>
    </form>
  );
}

export default Search;
