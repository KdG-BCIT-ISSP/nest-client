"use client";

import ThumbsUp from "@/public/svg/Post/ThumbsUp";
import Comments from "@/public/svg/Post/Comment";
import Bookmark from "@/public/svg/Post/Bookmark";
import Share from "@/public/svg/Post/Share";
import ArrowLeft from "@/public/svg/ArrowLeft";
import ArrowRight from "@/public/svg/ArrowRight";
import MoreButton from "@/public/svg/MoreButton";
import Button from "@/components/Button";

const colors = [
  { name: "Primary", value: "bg-primary text-black" },
  { name: "Secondary", value: "bg-secondary text-black" },
  { name: "Tertiary", value: "bg-tertiary text-black" },
  { name: "Accent", value: "bg-accent text-black" },
  { name: "Muted", value: "bg-muted text-black" },
  { name: "Container", value: "bg-container text-black" },
  { name: "Text", value: "bg-black text-white" },
];

export default function StorybookPage() {
  const handleClick = () => {
    alert("Button was clicked!");
  };

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
        <Button
          label="Button"
          onClick={handleClick}
          className="inline-block w-auto px-4 py-2 bg-blue-500 text-white rounded"
        />
        <div className="flex flex-row gap-5">
          <ThumbsUp count={32} />
          <Comments count={12} />
          <ThumbsUp count={40} post onClick={() => alert(1)} />
          <Comments count={60} post onClick={() => alert(1)} />
          <Bookmark count={33} onClick={() => alert(1)} />
          <Share count={66} onClick={() => alert(1)} />
        </div>
        <div className="flex flex-row gap-5">
          <ArrowLeft onClick={() => alert("arrowleft")} />
          <ArrowRight onClick={() => alert("arrowright")} />
        </div>
        <MoreButton onClick={() => alert("arrowright")} />
      </main>
    </div>
  );
}
