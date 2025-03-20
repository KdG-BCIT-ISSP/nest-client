import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const getProfile = async () => {
  const response = await axiosInterceptor.get("/member/me", {
    requiresAuth: true,
  } as CustomAxiosRequestConfig);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axiosInterceptor.get("/member/all", {
    requiresAuth: true,
  } as CustomAxiosRequestConfig);
  return response.data;
};
