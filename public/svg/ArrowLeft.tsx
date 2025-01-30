import { MouseEventHandler } from "react";

export default function ArrowLeft({
  onClick,
}: {
  onClick: MouseEventHandler<SVGSVGElement>;
}) {
  return (
    <svg
      width={47}
      height={59}
      viewBox="0 0 47 59"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      cursor="pointer"
      onClick={onClick}
    >
      <path
        d="M20.266 46.946L4.993 31.673l15.273-15.272 2.625 2.59-10.807 10.807h27.989v3.75H12.084l10.807 10.773-2.625 2.625z"
        fill="#607962"
      />
    </svg>
  );
}
