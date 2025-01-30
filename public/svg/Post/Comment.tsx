import { SvgPost } from "@/types/SvgPost";

export default function Comments({ count, post, onClick }: SvgPost) {
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
        width: "80px",
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.0956 19.9706C12.8756 19.9706 14.6157 19.4428 16.0957 18.4539C17.5758 17.4649 18.7293 16.0593 19.4105 14.4148C20.0917 12.7703 20.2699 10.9607 19.9226 9.21483C19.5754 7.469 18.7182 5.86536 17.4595 4.60668C16.2009 3.34801 14.5972 2.49085 12.8514 2.14358C11.1056 1.79631 9.29597 1.97454 7.65143 2.65573C6.0069 3.33692 4.60129 4.49047 3.61235 5.97051C2.62342 7.45056 2.09558 9.19061 2.09558 10.9706C2.09558 12.4586 2.45558 13.8616 3.09558 15.0976L2.09558 19.9706L6.96858 18.9706C8.20458 19.6106 9.60858 19.9706 11.0956 19.9706Z"
          stroke="#CD6A6A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span style={{ color: "#CD6A6A", fontSize: "16px" }}>{count}</span>
    </div>
  );
}
