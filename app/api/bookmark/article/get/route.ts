import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../../axiosInterceptor";

export const getArticleBookmarks = async () => {
  const response = await axiosInterceptor.get(`content/post/article`, {
    requiresAuth: true,
  } as CustomAxiosRequestConfig);
  return response.data;
};
