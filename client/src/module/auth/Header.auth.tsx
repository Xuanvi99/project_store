function Header({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center gap-y-2">
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
}

export default Header;
