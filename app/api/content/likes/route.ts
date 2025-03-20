import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const getContentLikes = async (contentId: number) => {
  const response = await axiosInterceptor.get(`content/${contentId}/likes`, {
    requiresAuth: false,
  } as CustomAxiosRequestConfig);
  return response.data;
};
