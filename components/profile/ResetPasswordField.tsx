import React, { useState } from "react";
import Button from "../Button";
import { put } from "@/app/lib/fetchInterceptor";

export default function ResetPasswordField() {
  const InputFieldLabels = ["Old Password", "New Password", "Confirm Password"];

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  useState("");
  const [success, setSuccess] = useState<string | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await put("/api/password/change", {
        oldPassword: oldPassword,
        newPassword: newPassword,
      });

      if (response) {
        setSuccess("Password changed successfully.");
      } else {
        setError("Password change failed. Try again.");
      }
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response
      ) {
        const message =
          (error.response as { data?: { message?: string } }).data?.message ||
          "An unexpected error occurred";
        setError(message);
      } else {
        const errorMsg = error instanceof Error ? error.message : String(error);
        const cleanedMsg = errorMsg.replace(
          /^Request failed:\s*\d+\s*-\s*/,
          ""
        );
        setError(cleanedMsg);
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-3 pt-10">
      <label
        htmlFor="oldPassword"
        className="text-sm font-medium text-gray-900 block mb-2"
      >
        {InputFieldLabels[0]}
      </label>
      <input
        type="password"
        name="oldPassword"
        id="oldPassword"
        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        required
      />
      <label
        htmlFor="newPassword"
        className="text-sm font-medium text-gray-900 block mb-2"
      >
        {InputFieldLabels[1]}
      </label>
      <input
        type="password"
        name="newPassword"
        id="newPassword"
        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <label
        htmlFor="confirmPassword"
        className="text-sm font-medium text-gray-900 block mb-2"
      >
        {InputFieldLabels[2]}
      </label>
      <input
        type="password"
        name="confirmPassword"
        id="confirmPassword"
        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-500 text-sm">{success}</div>}
      <div className="flex justify-end w-full">
        <Button
          label="Reset"
          onClick={handleResetPassword}
          className="bg-secondary text-white font-bold rounded-md text-sm px-5 py-2.5 block bt-2 border mt-4"
        />
      </div>
    </div>
  );
}
