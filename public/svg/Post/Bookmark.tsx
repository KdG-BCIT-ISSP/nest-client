import { SvgPost } from "@/types/SvgPost";

export default function Bookmark({
  count,
  onClick,
  post,
  container,
  filled = false,
}: SvgPost) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "6px 10px",
        borderRadius: "8px",
        cursor: "pointer",
        width: container ? "60px" : "40px",
      }}
    >
      <svg
        width="21"
        height="20"
        viewBox="0 0 21 20"
        fill={filled ? "#CD6A6A" : "none"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.00795 15.3196L2.80795 17.1196C2.14128 17.403 1.50795 17.349 0.90795 16.9576C0.30795 16.5663 0.00794983 16.012 0.00794983 15.2946V2.31963C0.00794983 1.76963 0.20395 1.29896 0.59595 0.907626C0.98795 0.516293 1.45862 0.320293 2.00795 0.319626H12.0079C12.558 0.319626 13.0289 0.515626 13.4209 0.907626C13.813 1.29963 14.0086 1.77029 14.0079 2.31963V15.2946C14.0079 16.0113 13.708 16.5656 13.108 16.9576C12.5079 17.3496 11.8746 17.4036 11.208 17.1196L7.00795 15.3196ZM7.00795 13.1196L12.0079 15.2696V2.31963H2.00795V15.2696L7.00795 13.1196ZM7.00795 2.31963H2.00795H12.0079H7.00795Z"
          fill="#CD6A6A"
        />
      </svg>

      <span style={{ color: "#CD6A6A", fontSize: "16px" }}>{count}</span>
    </div>
  );
}
