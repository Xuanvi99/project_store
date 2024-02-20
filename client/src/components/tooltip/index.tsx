import Portal from "../portal";

interface ITooltipProps {
  children: React.ReactNode;
  coords?: DOMRect;
  scrollY?: number;
}

function Tooltip({ children, coords, scrollY = 0 }: ITooltipProps) {
  if (!coords) return;
  return (
    <Portal>
      <div
        className={`z-50 absolute translate-y-full`}
        style={{
          left: `${coords.left + coords.width / 2}px`,
          top: `${coords.top + coords.height + scrollY}px`,
        }}
      >
        {children}
      </div>
    </Portal>
  );
}

export default Tooltip;
