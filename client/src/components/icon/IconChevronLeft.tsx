export default function IconChevronLeft({
  size = 50,
  className,
  onClick,
}: {
  size?: number;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <svg
      fill="currentColor"
      onClick={onClick}
      className={className}
      height={size}
      viewBox="0 0 100 100"
    >
      <path
        d="M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z"
        className="arrow"
      />
    </svg>
  );
}
