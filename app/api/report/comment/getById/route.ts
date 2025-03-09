import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../../axiosInterceptor";

export const getCommentReportsById = async (commentId: string) => {
  const response = await axiosInterceptor.get("/report/comment", {
    requiresAuth: true,
    params: { commentId },
  } as CustomAxiosRequestConfig);
  return response.data;
};
