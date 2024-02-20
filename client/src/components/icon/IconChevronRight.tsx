export default function IconChevronRight({
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
      onClick={onClick}
      className={className}
      height={size}
      fill="currentColor"
      viewBox="0 0 100 100"
    >
      <path
        d="M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z"
        className="arrow"
        transform="translate(100, 100) rotate(180) "
      />
    </svg>
  );
}
