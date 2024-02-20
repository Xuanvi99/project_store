import { option } from "./Dropdown";

function Option({
  optionData,
  onClick,
}: {
  optionData: option;
  onClick: (option: option) => void;
}) {
  return (
    <option
      onClick={() => onClick(optionData)}
      data-value={optionData.value}
      className="h-10 px-2 leading-10 list-none cursor-pointer hover:bg-orange hover:text-white"
    >
      {optionData.label}
    </option>
  );
}

export default Option;
