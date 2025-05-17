import { atom } from "jotai";

export const chatMemberAtom = atom<{
  memberId: string;
  username: string;
} | null>(null);
