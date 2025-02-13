import { atom } from "jotai";

export const userAtom = atom({
    username: "",
    email: "",
    region: "",
    avatar: "/images/default_profile_image.png",
});
