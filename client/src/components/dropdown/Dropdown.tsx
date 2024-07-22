import { useEffect, useState } from "react";
import { useClickOutSide } from "../../hook";
import { cn } from "../../utils";
import { IconDown } from "../icon";
import Option from "./Option";
import Select from "./Select";

export type optionDropdown = {
  id: string | number;
  label: string;
  value: string;
};

interface IDropdownProps<T> {
  title: string;
  value: string;
  options: T[];
  className?: {
    select?: string;
    option?: string;
    wrap?: string;
  };
  handleSelect?: (option: optionDropdown) => void;
}

function Dropdown({
  title,
  options,
  className,
  handleSelect,
  value,
}: IDropdownProps<optionDropdown>) {
  const {
    show: showOptions,
    handleShow,
    nodeRef,
  } = useClickOutSide<HTMLDivElement>();

  const [option, setOption] = useState<{ label: string; value: string }>({
    label: title,
    value: value,
  });

  const handleClickOptions = (options: optionDropdown) => {
    setOption({ label: options.label, value: options.value });
    if (handleSelect) handleSelect(options);
  };

  useEffect(() => {
    const index = options.findIndex((option) => option.value === value);
    if (index > -1) {
      setOption({ label: options[index].label, value: options[index].value });
    } else {
      setOption({ label: title, value: value });
    }
  }, [options, title, value]);

  return (
    <div
      className={cn(
        "min-w-[150px] bg-white relative rounded-lg text-sm",
        className?.wrap
      )}
    >
      <Select
        ref={nodeRef}
        onClick={handleShow}
        className={"rounded-md " + className?.select}
      >
        <h3 className="pr-3">{option.label}</h3>
        <span className={showOptions ? "rotate-180" : "rotate-0"}>
          <IconDown></IconDown>
        </span>
      </Select>
      {showOptions && (
        <div
          className={cn(
            "w-full absolute left-0 top-[102%] rounded-b-md bg-white z-20 shadow-shadowButton drop-shadow-dropdown",
            className?.option
          )}
        >
          {options &&
            options.length > 0 &&
            options.map((item) => {
              return (
                <Option
                  key={item.id}
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
