"use client";

import Button from "@/components/Button";
import { useEffect, useState } from "react";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center p-8 sm:p-20 bg-white font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-2xl font-bold mb-6">Home Page</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-md text-center">
          {colors.map((color) => (
            <div
              key={color.name}
              className={`p-4 rounded-sm ${color.value} font-semibold`}
            >
              {color.name}
            </div>
          ))}
        </div>
        <div className="flex space-x-2 mt-6">
          <Button
            label="Button"
            onClick={handleClick}
            className="inline-block w-auto px-4 py-2 bg-blue-500 text-white rounded"
          />
          {/* <Button
            onClick={handleClick}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            <ul className="list-disc pl-4">
              <li className="text-sm">Testing</li>
              <li className="text-sm">Children</li>
              <li className="text-sm">Buttons</li>
            </ul>
          </Button> */}
        </div>
      </main>
    </div>
  );
}

// test button
const handleClick = () => {
  alert("Button was clicked!");
};
