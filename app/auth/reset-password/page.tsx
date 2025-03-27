"use client";

import { useState } from "react";
import Link from "next/link";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { put } from "@/app/lib/fetchInterceptor";

export default function ForgetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetPassword = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const url = "";

    try {
      const response = await put(`/api/password/reset${url}`, {
        newPassword: password,
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
      } else {
        setError(data);
        setSuccess(null);
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
      setSuccess(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="pt-5">
      <div className="flex flex-col items-center justify-center px-6 mx-auto lg:py-0 h-full">
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 mt-20">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Reset Password
            </h1>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-500 text-sm text-center">{success}</p>
            )}

            <form className="space-y-4 md:space-y-6" onSubmit={resetPassword}>
              <InputField
                labelText="New Password"
                value={password}
                type="password"
                name="password"
                id="password"
                onChange={setPassword}
              />
              <InputField
                labelText="Confirm Password"
                value={confirmPassword}
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                onChange={setConfirmPassword}
              />

              <Button
                type="submit"
                className="w-full text-white bg-secondary text-white hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50"
                label="Send"
                disabled={isLoading}
              />

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Go Back to
                <Link
                  href="/auth/login"
                  className="ml-2 font-medium hover:underline dark:text-primary-500"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
