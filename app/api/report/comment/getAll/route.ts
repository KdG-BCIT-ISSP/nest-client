import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../../axiosInterceptor";

export const getCommentReports = async () => {
  const response = await axiosInterceptor.get("/report/comment", {
    requiresAuth: true,
  } as CustomAxiosRequestConfig);
  return response.data;
};
