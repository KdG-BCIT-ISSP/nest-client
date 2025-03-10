import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../../axiosInterceptor";

export const getViews = async (contentId: number) => {
  const response = await axiosInterceptor.post(`/content/${contentId}/views`, {
    requiresAuth: true,
  } as CustomAxiosRequestConfig);
  return response.data;
};
