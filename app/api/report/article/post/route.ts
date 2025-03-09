import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../../axiosInterceptor";

export const reportArticle = async (postId: string) => {
  const response = await axiosInterceptor.post("/report/article", {
    requiresAuth: true,
    params: { postId },
  } as CustomAxiosRequestConfig);
  return response.data;
};
