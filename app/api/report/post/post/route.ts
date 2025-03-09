import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../../axiosInterceptor";

export const reportPost = async (postId: string) => {
  const response = await axiosInterceptor.post("/report/post", {
    requiresAuth: true,
    params: { postId },
  } as CustomAxiosRequestConfig);
  return response.data;
};
