import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const getPost = async () => {
  const response = await axiosInterceptor.get("/posts", {
    requiresAuth: true,
  } as CustomAxiosRequestConfig);
  return response.data;
};
