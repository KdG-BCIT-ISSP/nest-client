import { CardType } from "@/types/CardType";
import { Like, Comments } from "../Icons";
import { decodeAndTrim } from "@/utils/trimContent";
import Link from "next/link";

export default function Card({
  id,
  header,
  content,
  likes,
  comments,
  type,
}: CardType) {
  return (
    <Link
      href={`/${type}/${id}`}
      className="block w-[330px] h-[350px] p-6 bg-container shadow-md rounded-sm hover:bg-muted flex flex-col justify-between"
    >
      <div>
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          {header}
        </h5>
        <p className="font-normal text-gray-700 overflow-hidden">
          {decodeAndTrim(content)}
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <Like count={likes || 0} />
        <Comments count={comments ?? 0} />
      </div>
    </Link>
  );
}
