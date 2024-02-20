type TCardInfoProps = {
  title?: string;
  children: React.ReactNode;
};

export default function CardInfo({ title, children }: TCardInfoProps) {
  return (
    <div className="flex items-center justify-start mt-auto font-semibold gap-x-2 text-gray ">
      <span className="text-black">{title}:</span>
      {children}
    </div>
  );
}
