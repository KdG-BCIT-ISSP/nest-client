import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../../axiosInterceptor";

export const getArticleReports = async () => {
  const response = await axiosInterceptor.get("/report/article", {
    requiresAuth: true,
  } as CustomAxiosRequestConfig);
  return response.data;
};
