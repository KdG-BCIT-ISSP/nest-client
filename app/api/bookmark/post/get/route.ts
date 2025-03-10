import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../../axiosInterceptor";

export const getPostBookmarks = async () => {
  const response = await axiosInterceptor.get(`content/post/bookmark`, {
    requiresAuth: true,
  } as CustomAxiosRequestConfig);
  return response.data;
};
