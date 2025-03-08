import * as React from "react";

interface DotsProps {
  comments?: boolean;
}

function Dots({ comments = false }: DotsProps) {
  const fillColor = comments ? "#CD6A6A" : "#000";

  return (
    <svg width={comments ? 16 : 19} height={4} viewBox="0 0 19 4" fill="none">
      <path
        d="M2.075 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm14 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-7 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        fill={fillColor}
      />
    </svg>
  );
}

export default Dots;
