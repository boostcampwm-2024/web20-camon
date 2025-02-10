export function RecordInfo({ title }: Readonly<{ title: string }>) {
  return (
    <div className="flex flex-col h-1/5 gap-4 p-5">
      <h1 className="text-text-strong font-bold text-4xl">{title}</h1>
    </div>
  );
}
