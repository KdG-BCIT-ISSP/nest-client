import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const postView = async (contentId: number) => {
  const response = await axiosInterceptor.post(
    `content/${contentId}/view`,
    {},
    { requiresAuth: true } as CustomAxiosRequestConfig
  );
  return response.data;
};
