import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const getTag = async () => {
  const response = await axiosInterceptor.get("/tag", {
    requiresAuth: true,
  } as CustomAxiosRequestConfig);
  return response.data;
};
