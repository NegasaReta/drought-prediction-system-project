import { useEffect, useState } from "react";
import Link from "next/link";
import { decodeJWT } from "../lib/auth";

export default function Sidebar() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const decoded = decodeJWT(token);
      setRole(decoded?.role);
    }
  }, []);

  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-800 p-6 hidden md:block">
      <h2 className="text-2xl font-bold mb-6">Menu</h2>
      <ul className="space-y-4">
        <li>
          <Link href="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/dashboard/alerts" className="hover:text-blue-600">
            Alerts
          </Link>
        </li>
        <li>
          <Link href="/dashboard/map" className="hover:text-blue-600">
            Map
          </Link>
        </li>
        <li>
          <Link href="/dashboard/charts" className="hover:text-blue-600">
            Charts
          </Link>
        </li>
        <li>
          <Link href="/dashboard/settings" className="hover:text-blue-600">
            Settings
          </Link>
        </li>
        <li>
          <Link href="/blog" className="hover:text-blue-600 font-semibold">
            Blog
          </Link>
        </li>
        {role === "Author" && (
          <li>
            <Link
              href="/dashboard/manage-articles"
              className="text-blue-600 font-bold hover:underline"
            >
              Manage Articles
            </Link>
          </li>
        )}
        {role === "Admin" && (
          <li>
            <Link
              href="/dashboard/admin"
              className="text-purple-600 font-bold hover:underline"
            >
              Admin Panel
            </Link>
          </li>
        )}
      </ul>
    </aside>
  );
}
