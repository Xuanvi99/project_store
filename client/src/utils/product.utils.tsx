export const handleFormatStatusProduct = (value: string) => {
  switch (value) {
    case "inactive":
      return (
        <p className="inline p-1 text-xs font-semibold text-red-500 bg-red-100 rounded-xs">
          Ngừng bán
        </p>
      );

    case "active":
      return (
        <p className="inline p-1 text-xs font-semibold rounded-sm text-emerald-500 bg-emerald-100">
          Đang bán
        </p>
      );

    default:
      break;
  }
};
