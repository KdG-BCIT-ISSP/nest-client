import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const addBookmark = async (postId: number) => {
  const response = await axiosInterceptor.post(
    `/posts/bookmark/add/${postId}`,
    {
      requiresAuth: true,
    } as CustomAxiosRequestConfig
  );
  return response.data;
};
