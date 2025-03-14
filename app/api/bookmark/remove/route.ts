import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const removeBookmark = async (postId: number) => {
  const response = await axiosInterceptor.delete(
    `/posts/bookmark/remove/${postId}`,
    {
      requiresAuth: true,
    } as CustomAxiosRequestConfig
  );
  return response.data;
};
