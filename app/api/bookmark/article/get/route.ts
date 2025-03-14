import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../../axiosInterceptor";

export const getArticleBookmarks = async () => {
  const response = await axiosInterceptor.get(`content/article/bookmark`, {
    requiresAuth: true,
  } as CustomAxiosRequestConfig);
  return response.data;
};
