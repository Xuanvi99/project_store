export default function Heading({ title }: { title: string }) {
  return (
    <div className="font-bold text-black min-h-[40px] cursor-pointer line-clamp-2 hover:text-blue">
      {title}
    </div>
  );
}
