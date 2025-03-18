import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const getViewsById = async (contentId: number) => {
  const response = await axiosInterceptor.get(`content/${contentId}/views`, {
    requiresAuth: true,
  } as CustomAxiosRequestConfig);
  return response.data;
};
