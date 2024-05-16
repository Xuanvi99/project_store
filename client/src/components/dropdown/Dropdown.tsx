import { useEffect, useState } from "react";
import { useClickOutSide } from "../../hook";
import { cn } from "../../utils";
import { IconDown } from "../icon";
import Option from "./Option";
import Select from "./Select";

export type option = { label: string; value: string; id: string };

interface IDropdownProps<T> {
  title: string;
  options: T[];
  className?: {
    select?: string;
    option?: string;
  };
  active?: string;
  handleSelect?: (value: string) => void;
}

function Dropdown({
  title,
  options,
  className,
  handleSelect,
  active,
}: IDropdownProps<option>) {
  const {
    show: showOptions,
    handleShow,
    nodeRef,
  } = useClickOutSide<HTMLUListElement>();
  const [label, setLabel] = useState<string>(title as string);

  const handleClickOptions = (options: option) => {
    setLabel(options.label);
    if (handleSelect) handleSelect(options.value);
  };

  useEffect(() => {
    if (active !== "4") {
      setLabel(title);
    }
  }, [active, title]);

  return (
    <div className={cn("min-w-[150px] bg-white relative rounded-md text-sm")}>
      <Select
        ref={nodeRef}
        onClick={handleShow}
        className={"" + className?.select}
      >
        <h3>{label}</h3>
        <span className={showOptions ? "rotate-180" : "rotate-0"}>
          <IconDown></IconDown>
        </span>
      </Select>
      {showOptions && (
        <div
          className={cn(
            "w-full absolute left-0 top-[102%] rounded-b-md bg-white z-20 shadow-md shadow-black drop-shadow-dropdown",
            className?.option
          )}
        >
          {options &&
            options.length > 0 &&
            options.map((item) => {
              return (
                <Option
                  key={item.value}
                  optionData={item}
                  onClick={handleClickOptions}
                ></Option>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
