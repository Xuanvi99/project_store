import { optionDropdown } from "./Dropdown";

function Option({
  optionData,
  onClick,
}: {
  optionData: optionDropdown;
  onClick: (option: optionDropdown) => void;
}) {
  return (
    <option
      onClick={() => onClick(optionData)}
      data-value={optionData.value}
      className="h-10 px-2 leading-10 list-none cursor-pointer border-b-1 border-grayCa hover:bg-orangeFe hover:text-white"
    >
      {optionData.label}
    </option>
  );
}

export default Option;
