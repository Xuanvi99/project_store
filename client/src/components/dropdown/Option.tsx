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
      className="px-2 py-2 list-none cursor-pointer border-b-1 font-semibold border-grayCa hover:bg-orangeFe hover:text-white"
    >
      {optionData.label}
    </option>
  );
}

export default Option;
