import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../../axiosInterceptor";

export const isLiked = async (contentId: number) => {
  const response = await axiosInterceptor.get(`/content/${contentId}/isLiked`, {
    requiresAuth: true,
  } as CustomAxiosRequestConfig);
  return response.data;
};
