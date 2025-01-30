export default function Footer() {
  return (
    <footer className="bg-tertiary text-white py-4 flex justify-between items-center px-6">
      <span className="text-xl font-semibold whitespace-nowrap text-white">
        LOGO
      </span>
      <p className="text-xs">
        © {new Date().getFullYear()} KDG Research Center. All rights reserved.
      </p>
    </footer>
  );
}
