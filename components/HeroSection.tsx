import Image from "next/image";
import { HeroSectionType } from "@/types/HeroSectionType";

export default function HeroSection({
  img,
  title,
  subtitle,
  direction = "left",
}: HeroSectionType) {
  const alignmentClass = direction === "left" ? "items-start" : "items-end";

  return (
    <div className="relative w-full h-[400px] rounded-t-lg md:rounded-none overflow-hidden">
      <Image
        src={img}
        alt="Article picture"
        fill
        style={{ objectFit: "cover" }}
        priority
      />

      <div className="absolute inset-0 bg-black bg-opacity-40" />

      <div
        className={`relative z-10 flex flex-col ${alignmentClass} justify-center h-full p-8 text-white`}
      >
        <h2 className="text-4xl font-bold mb-5">{title}</h2>
        <p className="max-w-lg text-xl">{subtitle}</p>
      </div>
    </div>
  );
}
