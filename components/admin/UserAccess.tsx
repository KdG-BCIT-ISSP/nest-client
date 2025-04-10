"use client";
export const dynamic = "force-dynamic";

import { get } from "@/app/lib/fetchInterceptor";
import UserRoleToggle from "@/components/admin/UserRoleToggle";
import { useEffect, useState } from "react";
import Loader from "../Loader";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function UserAccessComponent() {
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [, setError] = useState(null);

  async function fetchUsers() {
    try {
      setLoading(true);
      setError(null);

      const data = await get("/api/member/all");
      setAllUsers(data);
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }

  function getUserRole(users: User[]) {
    let uniqueRoles = [...new Set(users.map((user) => user.role))];
    if (uniqueRoles.includes("SUPER_ADMIN")) {
      uniqueRoles = uniqueRoles.filter((role) => role !== "SUPER_ADMIN");
    }
    return uniqueRoles;
  }

  useEffect(() => {
    fetchUsers();
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(false);
  }, []);

  const tableHeaders = ["Username", "Email", "Role"];

  const searchUsers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    if (searchValue === "") {
      setUsers(allUsers);
    } else {
      const filteredUsers = allUsers.filter((user) =>
        user.email.toLowerCase().includes(searchValue.toLowerCase())
      );
      setUsers(filteredUsers);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4">
      {/* search bar */}

      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50"
          placeholder="enter email..."
          onChange={searchUsers}
        />
      </div>

      <div className="relative pt-2">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {tableHeaders.map((header, index) => (
                <th key={index} scope="col" className="px-6 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="bg-white">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {user.username}
                </th>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <UserRoleToggle
                    id={user.id}
                    currentRole={user.role}
                    menuItems={getUserRole(users)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
