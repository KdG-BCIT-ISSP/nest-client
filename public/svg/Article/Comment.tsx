import * as React from "react";

function ArticleComment({
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
        d="M24.207 26.127a9 9 0 10-8-4.873l-1 4.872 4.873-1c1.236.64 2.64 1 4.127 1z"
        stroke="#CD6A6A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
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

export default ArticleComment;
