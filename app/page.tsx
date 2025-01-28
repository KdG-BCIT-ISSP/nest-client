const colors = [
  { name: "Primary", value: "bg-primary text-black" },
  { name: "Secondary", value: "bg-secondary text-black" },
  { name: "Tertiary", value: "bg-tertiary text-black" },
  { name: "Accent", value: "bg-accent text-black" },
  { name: "Muted", value: "bg-muted text-black" },
  { name: "Container", value: "bg-container text-black" },
  { name: "Text", value: "bg-black text-white" },
];

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-white font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-md">
          {colors.map((color) => (
            <div
              key={color.name}
              className={`p-4 rounded-sm ${color.value} text-center font-semibold`}
            >
              {color.name}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
