import axiosInterceptor from "../../axiosInterceptor";

export const join = async (
  username: string,
  email: string,
  password: string
) => {
  const response = await axiosInterceptor.post("/member/join", {
    username,
    email,
    password,
  });
  return response.data;
};
