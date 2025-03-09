import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../../axiosInterceptor";

export const getArticleReportsById = async (postId: string) => {
  const response = await axiosInterceptor.get("/report/article", {
    requiresAuth: true,
    params: { postId },
  } as CustomAxiosRequestConfig);
  return response.data;
};
