"use client";

import { useState } from "react";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { post } from "@/app/lib/fetchInterceptor";

interface ForgotPasswordProps {
  onClose: () => void;
}

export default function ForgotPassword({ onClose }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleForgetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await post("/api/password/forgot", {
        email: email,
        resetUrl: `${window.location.origin}/auth/reset-password`,
      });

      let data;
      if (response.headers.get("Content-Type")?.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (response) {
        setSuccess(data);
        setError(null);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(data);
        setSuccess(null);
      }
    } catch {
      setError("An error occurred. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
          Reset Password
        </h1>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
      <p className="text-md text-gray-800">
        You will receive a link to reset your password.
      </p>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {success && (
        <p className="text-green-500 text-sm text-center">{success}</p>
      )}

      <form className="space-y-4 md:space-y-6" onSubmit={handleForgetPassword}>
        <InputField
          labelText="Email"
          value={email}
          type="email"
          name="email"
          id="email"
          onChange={setEmail}
          placeholder="username@domain.com"
        />

        <Button
          type="submit"
          className="w-full text-white bg-secondary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50"
          label="Send"
        />

        <p className="text-sm font-light text-gray-500">
          <button
            onClick={onClose}
            className="ml-2 font-medium hover:underline text-primary-600"
          >
            Go Back to Sign in
          </button>
        </p>
      </form>
    </div>
  );
}
