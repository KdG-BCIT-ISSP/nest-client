import Comments from "@/public/svg/Post/Comment";
import ThumbsUp from "@/public/svg/Post/ThumbsUp";
import { CardType } from "@/types/CardType";

export default function Card({ header, content, likes, comments }: CardType) {
  return (
    <a
      href="#"
      className="block p-6 bg-container shadow-md rounded-sm shadow-sm hover:bg-muted"
    >
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
        {header}
      </h5>
      <p className="font-normal text-gray-700">{content}</p>
      <div className="flex justify-end p-4 gap-2">
        <span className="text-gray-600">
          <ThumbsUp count={likes} />
        </span>
        <span className="ml-2 text-gray-600">
          <Comments count={comments} />
        </span>
      </div>
    </a>
  );
}
