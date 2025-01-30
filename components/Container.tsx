import Card from "./Card";
import Image from "next/image";

export default function Container() {
  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="section1">
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-black dark:text-white pb-4">
          Most Liked Tips
        </h2>
        <div className="top_content_container flex">
          <div className="banner_image_container w-1/2">
            <Image
              src="/images/pregnancy1.jpg"
              alt="pregnancy photo"
              className="w-full h-auto object-cover h-full"
              width={400}
              height={400}
              priority
            />
          </div>
          <div className="banner_image_container w-1/2 bg-secondary p-16">
            <h3 className="mb-2 text-2xl font-bold tracking-tight text-white dark:text-white pb-4">
              Surviving Sleepless Nights: Tips for New Mothers
            </h3>
            <p className="font-normal text-lg text-white dark:text-gray-400">
              Sleepless nights can be one of the most challenging parts of being
              a new mom. It’s essential to find moments to rest, even when it
              feels impossible.
            </p>
          </div>
        </div>
        <div className="cards_container flex">
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>
  );
}
