"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { accessTokenAtom } from "@/atoms/auth/atom";

export function useInitAuth() {
  const [, setAccessToken] = useAtom(accessTokenAtom);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
    }
  }, [setAccessToken]);
}
