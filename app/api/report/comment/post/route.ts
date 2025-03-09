import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../../axiosInterceptor";

export const reportCommment = async (commentId: number, reason: string) => {
  const response = await axiosInterceptor.post(
    `/report/comment/${commentId}`,
    { reason },
    { requiresAuth: true } as CustomAxiosRequestConfig
  );
  return response.data;
};
