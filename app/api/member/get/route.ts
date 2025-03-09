import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const getProfile = async () => {
  const response = await axiosInterceptor.get("/member/me", {
    requiresAuth: true,
  } as CustomAxiosRequestConfig);
  return response.data;
};
