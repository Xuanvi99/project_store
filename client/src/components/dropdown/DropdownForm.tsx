import { useCallback, useEffect, useState } from "react";
import { useClickOutSide } from "../../hook";
import { cn } from "../../utils";
import { IconDown } from "../icon";
import Option from "./Option";
import Select from "./Select";
import { FieldValues, UseControllerProps, useWatch } from "react-hook-form";
import { Input } from "../input";
type options = { label: string; value: string; id: string };

interface IDropdownFormProps<T> {
  title: string;
  options: T[];
  name: string;
  error?: boolean;
  search?: {
    display: boolean;
    place: "top" | "bottom";
  };
  className?: {
    select?: string;
    option?: string;
  };
  disable?: boolean;
  onClick: (option: T) => void;
}

function DropdownForm<T extends FieldValues>({
  title,
  options,
  className,
  error,
  disable = false,
  control,
  name,
  search,
  onClick,
}: IDropdownFormProps<options> & UseControllerProps<T>) {
  const selectValue = useWatch<T>({
    control,
    name: name,
  });

  const {
    show: showOptions,
    handleShow,
    nodeRef,
  } = useClickOutSide<HTMLUListElement>("input");

  const [label, setLabel] = useState<string>(title);
  const [textSearch, setTextSearch] = useState<string>("");
  const [listOptions, setListOptions] = useState<options[]>([]);

  useEffect(() => {
    if (!selectValue) setLabel(title);
  }, [selectValue, title]);

  const handleSearchOptions = useCallback(
    (textSearch: string) => {
      const optionCopy: options[] = [];
      if (!textSearch) setListOptions([...options]);
      for (let i = 0; i < options.length; i++) {
        if (options[i].label.toLowerCase().includes(textSearch.toLowerCase())) {
          optionCopy.push(options[i]);
        }
      }
      setListOptions([...optionCopy]);
    },
    [options]
  );

  useEffect(() => {
    handleSearchOptions(textSearch);
  }, [handleSearchOptions, textSearch]);

  const handleClickOptions = (options: options) => {
    setLabel(options.label);
    onClick(options);
    setTextSearch("");
  };

  return (
    <div className={cn("min-w-[150px] bg-white relative rounded-md text-sm")}>
      <Select
        ref={nodeRef}
        onClick={() => {
          !disable && handleShow();
        }}
        className={cn(
          disable && "cursor-not-allowed",
          error && "border-red-600 border-1",
          className?.select
        )}
      >
        <h3>{label}</h3>
        <span className={showOptions ? "rotate-180" : "rotate-0"}>
          <IconDown></IconDown>
        </span>
      </Select>
      {showOptions && (
        <div
          className={cn(
            "w-full absolute left-0 top-[105%] rounded-b-md bg-white z-20 shadow-md shadow-black drop-shadow-dropdown"
          )}
        >
          {search?.display && search?.place === "top" && (
            <Input
              type="text"
              name="search"
              value={textSearch}
              onChange={(event) => {
                setTextSearch(event.target.value);
              }}
              className={{
                input: "rounded-none text-sm border-b-2 border-b-gray",
              }}
              placeholder="Tìm kiếm..."
            />
          )}
          <div className={className?.option}>
            {listOptions &&
              listOptions.length > 0 &&
              listOptions.map((item) => {
                return (
                  <Option
                    key={item.value}
                    optionData={item}
                    onClick={handleClickOptions}
                  ></Option>
                );
              })}
            {listOptions.length === 0 && (
              <div className="px-1 py-2 font-semibold text-center text-red-600">
                Không tìm thấy
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DropdownForm;
