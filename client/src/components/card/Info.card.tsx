type TCardInfoProps = {
  title?: string;
  children: React.ReactNode;
};

export default function Info({ title, children }: TCardInfoProps) {
  return (
    <div className="flex items-center justify-start  font-semibold gap-x-2 text-gray">
      <span className="text-black">{title}:</span>
      {children}
    </div>
  );
}
