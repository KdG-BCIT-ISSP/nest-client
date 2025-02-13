import axiosInterceptor from "../../axiosInterceptor";

export const login = async (email: string, password: string) => {
  const response = await axiosInterceptor.post("/member/login", {
    email,
    password,
  });
  return response.data;
};
