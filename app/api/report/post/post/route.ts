import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../../axiosInterceptor";

export const reportPost = async (postId: number, reason: string) => {
  const response = await axiosInterceptor.post(
    `/report/post/${postId}`,
    { reason },
    { requiresAuth: true } as CustomAxiosRequestConfig
  );
  return response.data;
};
