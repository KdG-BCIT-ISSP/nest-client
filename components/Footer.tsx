export default function Footer() {
  return (
    <footer className="bg-tertiary text-white py-4 text-center px-6 z-30">
      <p className="text-xs">
        © {new Date().getFullYear()} KDG Research Center. All rights reserved.
      </p>
    </footer>
  );
}
