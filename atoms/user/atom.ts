import { atom } from "jotai";

export const userAtom = atom({
  userId: "",
  username: "",
  email: "",
  region: "",
  avatar: "/images/default_profile_image.png",
  role: "",
});
