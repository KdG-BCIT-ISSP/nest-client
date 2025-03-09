import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../../axiosInterceptor";

export const reportArticle = async (postId: number, reason: string) => {
  const response = await axiosInterceptor.post(
    `/report/article/${postId}`,
    { reason },
    { requiresAuth: true } as CustomAxiosRequestConfig
  );
  return response.data;
};
