import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../../axiosInterceptor";

export const getPostReportsById = async (postId: string) => {
  const response = await axiosInterceptor.get("/report/post", {
    requiresAuth: true,
    params: { postId },
  } as CustomAxiosRequestConfig);
  return response.data;
};
