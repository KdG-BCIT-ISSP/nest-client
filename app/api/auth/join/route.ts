import axios from "axios";

export const join = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const response = await axios.post("/api/member/join", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Sign up failed");
    } else {
      throw new Error("Sign up failed");
    }
  }
};
