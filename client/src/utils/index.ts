import { cn } from "./twMerge";

export { cn };

export const formatPrice = (value: number | bigint): string => {
  return new Intl.NumberFormat().format(value);
};
