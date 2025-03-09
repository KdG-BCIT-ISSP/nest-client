import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../../axiosInterceptor";

export const reportComment = async (commentId: string) => {
  const response = await axiosInterceptor.post("/report/comment", {
    requiresAuth: true,
    params: { commentId },
  } as CustomAxiosRequestConfig);
  return response.data;
};
