import * as React from "react";

function ArticleBookmark({
  count,
  reported,
}: {
  count: number;
  reported?: boolean;
}) {
  return (
    <svg width={81} height={34} viewBox="0 0 81 34" fill="none">
      {!reported && (
        <rect
          x={0.501465}
          y={0.716064}
          width={79.1006}
          height={32.7113}
          rx={4.5}
          fill="#fff"
          // stroke="#CD6A6A"
        />
      )}
      <path
        d="M22.282 23.59l-4.2 1.8c-.666.284-1.3.23-1.9-.161-.6-.392-.9-.946-.9-1.663V10.59c0-.55.196-1.021.588-1.412a1.93 1.93 0 011.412-.588h10c.55 0 1.021.196 1.413.588.392.392.588.862.587 1.412v12.975c0 .716-.3 1.27-.9 1.663-.6.392-1.233.446-1.9.162l-4.2-1.8zm0-2.2l5 2.15V10.59h-10v12.95l5-2.15zm0-10.8h-5 10-5z"
        fill="#CD6A6A"
      />
      <text
        x="53"
        y="22"
        fill="#CD6A6A"
        fontSize="16"
        fontWeight="bold"
        textAnchor="middle"
      >
        {count}
      </text>
    </svg>
  );
}

export default ArticleBookmark;
