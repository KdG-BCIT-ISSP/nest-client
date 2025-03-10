import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../../axiosInterceptor";

export const getLikes = async (contentId: number) => {
  const response = await axiosInterceptor.get(`/content/${contentId}/likes`, {
    requiresAuth: true,
  } as CustomAxiosRequestConfig);
  return response.data;
};
