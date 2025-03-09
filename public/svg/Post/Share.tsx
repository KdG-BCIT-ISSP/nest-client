import { SvgPost } from "@/types/SvgPost";

export default function Share({ onClick, post }: SvgPost) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: post ? "6px 10px" : "0",
        border: post ? "2px solid #CD6A6A" : "none",
        borderRadius: post ? "8px" : "0",
        cursor: post ? "pointer" : "",
        width: post ? "100px" : "80px",
      }}
    >
      <svg
        width="21"
        height="20"
        viewBox="0 0 21 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.3101 9.70083C7.06724 9.70083 3.82469 10.8324 1.3525 13.2937C1.9113 11.6005 2.74603 9.99051 3.93641 8.63008C5.60558 6.72246 7.99608 5.27934 11.3808 4.7958L11.8101 4.73447V4.30083V1.50793L17.603 7.30083L11.8101 13.0937V10.2008V9.70083H11.3101ZM13.6637 4.77727L12.8101 3.92372V5.13083V5.60319L11.5178 5.80605C8.66414 6.19252 6.76765 7.33669 5.29784 8.79601L5.80659 9.62572C7.49681 9.06882 9.30349 8.70083 11.3101 8.70083H12.8101V9.47083V10.6779L13.6637 9.82438L15.8337 7.65438L16.1872 7.30083L15.8337 6.94727L13.6637 4.77727Z"
          fill="#CD6A6A"
          stroke="#CD6A6A"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}
