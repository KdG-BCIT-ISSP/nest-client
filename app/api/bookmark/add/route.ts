import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const removeBookmark = async (postId: number) => {
  const response = await axiosInterceptor.post(
    `/posts/bookmark/add/${postId}`,
    {
      requiresAuth: true,
    } as CustomAxiosRequestConfig
  );
  return response.data;
};
