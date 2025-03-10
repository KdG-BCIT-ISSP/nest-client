import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const getBookmarks = async () => {
  const response = await axiosInterceptor.get(`/posts/bookmark/`, {
    requiresAuth: true,
  } as CustomAxiosRequestConfig);
  return response.data;
};
