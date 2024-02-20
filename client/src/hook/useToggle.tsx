import { useState } from "react";

export default function useToggle(): {
  toggle: boolean;
  handleToggle: () => void;
} {
  const [toggle, setToggle] = useState<boolean>(false);
  const handleToggle = (): void => {
    setToggle((toggle) => !toggle);
  };

  return { toggle, handleToggle };
}
