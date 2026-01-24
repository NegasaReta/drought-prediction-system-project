import { useEffect, useState } from "react";
import Link from "next/link";
import { decodeJWT } from "../lib/auth";

export default function Navbar() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const decoded = decodeJWT(token);
      setRole(decoded?.role);
    }
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-800  shadow-md  p-4 md:hidden">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/dashboard"
          className="text-2xl font-bold text-blue-600 dark:text-blue-400"
        >
          Drought App
        </Link>
        <div className="space-x-4 flex items-center">
          <Link href="/dashboard/alerts" className="hover:text-blue-600">
            Alerts
          </Link>
          <Link href="/dashboard/map" className="hover:text-blue-600">
            Map
          </Link>
          <Link href="/dashboard/charts" className="hover:text-blue-600">
            Charts
          </Link>
          <Link href="/dashboard/settings" className="hover:text-blue-600">
            Settings
          </Link>
          <Link href="/blog" className="hover:text-blue-600 font-semibold">
            Blog
          </Link>
          {role === "Author" && (
            <Link
              href="/dashboard/manage-articles"
              className="text-blue-600 font-bold hover:underline"
            >
              Manage
            </Link>
          )}
          {role === "Admin" && (
            <Link
              href="/dashboard/admin"
              className="text-purple-600 font-bold hover:underline"
            >
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
