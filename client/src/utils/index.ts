import { cn } from "./twMerge";
import moment, { MomentInput } from "moment";
import "moment/dist/locale/vi";

export { cn };

export const formatPrice = (value: number | bigint): string => {
  return new Intl.NumberFormat().format(value);
};

export const momentVi = (
  time?: MomentInput,
  format?: moment.MomentFormatSpecification,
  strict?: boolean
) => {
  moment.updateLocale("vi", {
    relativeTime: {
      future: "trong %s",
      past: "%s trước",
      s: "vài giây",
      ss: "%d giây",
      m: "1 phút",
      mm: "%d phút",
      h: "1 giờ",
      hh: "%d giờ",
      d: "1 ngày",
      dd: "%d ngày",
      w: "1 tuần",
      ww: "%d tuần",
      M: "1 tháng",
      MM: "%d tháng",
      y: "1 năm",
      yy: "%d năm",
    },
  });
  return moment(time, format, strict).locale("vi");
};
