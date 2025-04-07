import React from "react";

interface PaginationButtonsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationButtonsProps) {
  return (
    <div className="flex justify-center mt-10">
      <button
        className="px-4 py-2 bg-gray-300 rounded mr-2 disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        Previous
      </button>
      <span className="px-4 py-2">
        Page {currentPage + 1} of {totalPages}
      </span>
      <button
        className="px-4 py-2 bg-gray-300 rounded ml-2 disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
      >
        Next
      </button>
    </div>
  );
}
