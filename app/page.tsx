import Container from "@/components/Container";
import Carousel from "@/components/Carousel";
import { cardsData } from "@/utils/cardData";

export default function Home() {
  return (
    <div className="flex flex-col bg-white font-[family-name:var(--font-geist-sans)]">
      <main className="flex-grow p-8 sm:p-20">
        <Container
          section_title="Most Liked Tips"
          top_post_image="/images/pregnancy1.jpg"
          top_post_header="Surviving Sleepless Nights: Tips for New Mothers"
          top_post_text="Sleepless nights can be one of the most challenging parts of being a new mom. 
                         It’s essential to find moments to rest, even when it feels impossible."
          href={"/posts"}
          likes={322}
          comments={123}
        />
        <Carousel cardsData={cardsData} />
      </main>
      <main className="flex-grow p-8 sm:p-20">
        <Container
          section_title="Most Liked Tips"
          top_post_image="/images/pregnancy1.jpg"
          top_post_header="Surviving Sleepless Nights: Tips for New Mothers"
          top_post_text="Sleepless nights can be one of the most challenging parts of being a new mom. 
                         It’s essential to find moments to rest, even when it feels impossible."
          href="/posts"
          likes={322}
          comments={123}
        />
        <Carousel cardsData={cardsData} />
      </main>
    </div>
  );
}
