import * as React from "react";

function ArticleThumpsUp({
  count,
  reported,
  isLiked,
}: {
  count: number;
  reported?: boolean;
  isLiked?: boolean;
}) {
  const baseColor = isLiked ? "#3B82F6" : "#CD6A6A";
  const fillColor = "#fff";

  return (
    <svg width={81} height={34} viewBox="0 0 81 34" fill="none">
      {!reported && (
        <rect
          x={0.501465}
          y={0.716064}
          width={79.1006}
          height={32.7113}
          rx={4.5}
          fill={fillColor}
          stroke={baseColor}
        />
      )}
      <path
        d="M25.002 15.07l-.986-.164a1 1 0 00.986 1.164v-1zm-11 0v-1a1 1 0 00-1 1h1zm2 11h11.36v-2h-11.36v2zm12.56-12h-3.56v2h3.56v-2zm-2.573 1.164l.805-4.835-1.972-.33-.806 4.837 1.973.328zM24.822 8.07h-.214v2h.214v-2zM21.28 9.85l-2.514 3.775 1.664 1.11 2.516-3.774-1.666-1.11zm-3.347 4.22h-3.93v2h3.93v-2zm-4.93 1v8h2v-8h-2zm17.302 8.588l1.2-6-1.96-.392-1.2 6 1.96.392zM18.765 13.625a1.003 1.003 0 01-.833.445v2a3 3 0 002.496-1.336l-1.663-1.11zm8.03-3.226a2 2 0 00-1.973-2.33v2l1.972.33zm1.767 5.67a.999.999 0 01.982 1.197l1.96.392a3 3 0 00-2.94-3.588l-.002 2zm-1.2 10a3 3 0 002.942-2.411l-1.96-.392a1 1 0 01-.982.804v2zm-2.754-18a4 4 0 00-3.329 1.782l1.666 1.11a1.998 1.998 0 011.663-.891v-2zm-8.606 16a1 1 0 01-1-1h-2a3 3 0 003 3v-2z"
        fill={baseColor}
      />
      <path d="M18.002 15.07v10" stroke={baseColor} strokeWidth={2} />
      <text
        x="53"
        y="22"
        fill={baseColor}
        fontSize="16"
        fontWeight="bold"
        textAnchor="middle"
      >
        {count}
      </text>
    </svg>
  );
}

export default ArticleThumpsUp;
