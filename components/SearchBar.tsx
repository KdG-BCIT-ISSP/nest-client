import MagnifyingIcon from "@/public/svg/MagnifyingIcon";

export default function SearchBar() {
  return (
    <div className="flex px-4 py-0 rounded-full border-2 overflow-hidden font-[sans-serif] bg-white">
      <MagnifyingIcon />
      <input
        type="text"
        placeholder="Search Something..."
        className="w-full outline-none border-none focus:ring-0 bg-transparent text-gray-600 text-sm"
      />
    </div>
  );
}
