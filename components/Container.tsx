import Card from "./Card";
import Image from "next/image";
import { HomePageContainer } from "@/types/HomePageContainer";

export default function Container({
  section_title,
  top_post_image,
  top_post_header,
  top_post_text,
}: HomePageContainer) {
  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="section1">
        <h2 className="section_title mb-2 text-3xl font-bold tracking-tight text-black dark:text-white pb-4">
          {section_title}
        </h2>
        <div className="top_post_container flex">
          <div className="top_post_image w-1/2">
            <Image
              src={top_post_image}
              alt="pregnancy photo"
              className="w-full h-full object-cover"
              width={400}
              height={400}
              priority
            />
          </div>
          <div className="top_post_title w-1/2 bg-secondary p-16">
            <h3 className="top_post_text mb-2 text-2xl font-bold tracking-tight text-white dark:text-white pb-4">
              {top_post_header}
            </h3>
            <p className="font-normal text-lg text-white dark:text-gray-400">
              {top_post_text}
            </p>
          </div>
        </div>
        <div className="cards_container flex">
          <Card
            header={"What Nobody Told Me About Postpartum Recovery"}
            content={
              "Before having my baby, I spent so much time preparing for the birth that I didn’t fully understand what recovery afterward would be like. Postpartum recovery is a ..."
            }
          />
          <Card
            header={"What Nobody Told Me About Postpartum Recovery"}
            content={
              "Before having my baby, I spent so much time preparing for the birth that I didn’t fully understand what recovery afterward would be like. Postpartum recovery is a ..."
            }
          />
          <Card
            header={"What Nobody Told Me About Postpartum Recovery"}
            content={
              "Before having my baby, I spent so much time preparing for the birth that I didn’t fully understand what recovery afterward would be like. Postpartum recovery is a ..."
            }
          />
        </div>
      </div>
    </div>
  );
}
