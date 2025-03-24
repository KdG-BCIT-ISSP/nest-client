import Image from "next/image";
import Link from "next/link";
import { HomePageContainer } from "@/types/HomePageContainer";
import MoreButton from "@/public/svg/MoreButton";
import ThumbsUp from "@/public/svg/Post/ThumbsUp";
import Comments from "@/public/svg/Post/Comment";

export default function Container({
  section_title,
  top_post_image,
  top_post_header,
  top_post_text,
  href,
  likes,
  comments,
}: HomePageContainer) {
  return (
    <div className="max-w-screen-lg mx-auto px-4">
      <div className="section1">
        <h2 className="section_title mb-2 text-3xl font-bold tracking-tight text-black pb-4 flex justify-between items-center">
          {section_title}
          <Link href={href} className="inline-block">
            <MoreButton />
          </Link>
        </h2>

        <div className="top_post_container flex rounded-sm overflow-hidden shadow-lg">
          <div className="top_post_image w-1/2 relative">
            <Image
              src={top_post_image}
              alt="pregnancy photo"
              className="w-full h-full object-cover"
              width={600}
              height={400}
              priority
            />
          </div>
          <div className="top_post_title w-1/2 bg-secondary p-8 lg:p-16">
            <h3 className="top_post_text mb-2 text-2xl font-bold tracking-tight text-white">
              {top_post_header}
            </h3>
            <p className="font-normal text-lg text-white/90">{top_post_text}</p>
            <div className="flex justify-end gap-2 pt-10">
              <span className="text-gray-600">
                <ThumbsUp count={likes} container />
              </span>
              <span className="text-gray-600">
                <Comments count={comments} container />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
