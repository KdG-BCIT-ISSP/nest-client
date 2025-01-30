import Comments from "@/public/svg/Post/Comment";
import ThumbsUp from "@/public/svg/Post/ThumbsUp";
import { CardType } from "@/types/CardType";

export default function Card({ header, content, likes, comments }: CardType) {
  return (
    <a
      href="#"
      className="block p-6 bg-container shadow-md rounded-sm shadow-sm hover:bg-muted dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
    >
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {header}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">{content}</p>
      <div className="flex justify-end p-4 gap-2">
        <span className="text-gray-600 dark:text-gray-300">
          <ThumbsUp count={likes} />
        </span>
        <span className="ml-2 text-gray-600 dark:text-gray-300">
          <Comments count={comments} />
        </span>
      </div>
    </a>
  );
}
