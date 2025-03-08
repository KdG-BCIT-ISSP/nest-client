import * as React from "react";

function ArticleShare({ count }: { count: number }) {
  return (
    <svg width={81} height={34} viewBox="0 0 81 34" fill="none">
      <rect
        x={0.501465}
        y={0.716064}
        width={79.1006}
        height={32.7113}
        rx={4.5}
        fill="#fff"
        stroke="#CD6A6A"
      />
      <path
        d="M24.685 18.972c-4.243 0-7.485 1.131-9.958 3.593.56-1.694 1.394-3.303 2.584-4.664 1.67-1.908 4.06-3.35 7.445-3.834l.43-.062V10.78l5.792 5.793-5.793 5.793v-3.393h-.5zm2.354-4.924l-.854-.853v1.679l-1.292.203c-2.854.386-4.75 1.53-6.22 2.99l.509.83c1.69-.557 3.496-.925 5.503-.925h1.5v1.977l.854-.854 2.17-2.17.353-.353-.353-.354-2.17-2.17z"
        fill="#CD6A6A"
        stroke="#CD6A6A"
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

export default ArticleShare;
