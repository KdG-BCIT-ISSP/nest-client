import { put } from "@/app/lib/fetchInterceptor";
import React, { useState } from "react";

interface UserRoleToggleProps {
  id: number;
  currentRole: string;
  menuItems: string[];
}

export default function UserRoleToggle({
  id,
  currentRole,
  menuItems,
}: UserRoleToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState(currentRole);
  const isSuperAdmin = currentRole === "SUPER_ADMIN";

  const changeUserRole = async (id: number, role: string) => {
    try {
      const response = await put(`/api/member/role/${id}`, {
        memberRole: role,
      });
      if (response) {
        window.alert("User role updated successfully");
      } else {
        window.alert("Failed to update user role");
      }
    } catch (err) {
      console.error("Failed to update user role:", err);
    }
  };

  const handleRoleChange = (newRole: string) => {
    if (newRole !== role) {
      changeUserRole(id, newRole);
      setRole(newRole);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative flex flex-wrap gap-2 mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-black bg-white border border-gray-500 hover:bg-gray-100 font-medium rounded-md text-sm px-5 py-2.5 text-center inline-flex items-center w-40 space-between flex justify-between"
        type="button"
        {...(isSuperAdmin && {
          disabled: true,
          title: "Super Admin cannot be changed",
        })}
      >
        {role}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-md shadow-sm w-44">
          <ul className="py-2 text-sm text-gray-700">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleRoleChange(item)}
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-100 w-full"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
