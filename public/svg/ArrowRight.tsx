import { MouseEventHandler } from "react";

export default function ArrowRight({
  onClick,
}: {
  onClick: MouseEventHandler<SVGSVGElement>;
}) {
  return (
    <svg
      onClick={onClick}
      width={35}
      height={59}
      viewBox="0 0 47 59"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      cursor="pointer"
    >
      <path
        d="M26.049 12.946L41.322 28.22 26.049 43.492 23.424 40.9 34.23 30.094H6.242v-3.75h27.989L23.424 15.57l2.625-2.625z"
        fill="#607962"
      />
    </svg>
  );
}
