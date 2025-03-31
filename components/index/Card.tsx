import { CardType } from "@/types/CardType";
import { Like, Comments } from "../Icons";

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
        <Like count={likes || 0} />
        <Comments count={comments ?? 0} />
      </div>
    </a>
  );
}
