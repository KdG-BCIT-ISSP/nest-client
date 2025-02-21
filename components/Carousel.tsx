import { useRef, useState, useEffect } from "react";
import ArrowLeft from "@/public/svg/ArrowLeft";
import ArrowRight from "@/public/svg/ArrowRight";
import Card from "./Card";
import { CardType } from "@/types/CardType";
import { chunkArray } from "@/utils/chunkArray";

const CARD_WIDTH = 330;
const CARDS_PER_SLIDE = 3;

export default function Carousel({ cardsData }: { cardsData: CardType[] }) {
  const slidesRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = chunkArray(cardsData, CARDS_PER_SLIDE);

  useEffect(() => {
    if (!slidesRef.current) return;
    const slideWidth = CARD_WIDTH * CARDS_PER_SLIDE;
    slidesRef.current.scrollTo({
      left: slideWidth * activeSlide,
      behavior: "smooth",
    });
  }, [activeSlide]);

  const handleNext = () => {
    setActiveSlide((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const handlePrev = () => {
    setActiveSlide((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="relative mt-8 mx-auto max-w-screen-lg px-4">
      <button
        className="absolute left-[-55px] top-1/2 -translate-y-1/2 z-10"
        onClick={handlePrev}
      >
        <ArrowLeft onClick={handlePrev} />
      </button>

      <div className="overflow-hidden">
        <div
          ref={slidesRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4"
        >
          {slides.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              className="flex-shrink-0 snap-start"
              style={{ width: CARD_WIDTH * CARDS_PER_SLIDE }}
            >
              <div className="flex gap-4 justify-center items-stretch">
                {slide.map((card, cardIndex) => (
                  <Card key={cardIndex} {...card} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="absolute right-[-55px] top-1/2 -translate-y-1/2 z-10"
        onClick={handleNext}
      >
        <ArrowRight onClick={handleNext} />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === activeSlide ? "bg-primary" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
