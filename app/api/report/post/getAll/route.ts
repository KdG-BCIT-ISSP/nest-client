import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../../axiosInterceptor";

export const getPostReports = async () => {
  const response = await axiosInterceptor.get("/report/post", {
    requiresAuth: true,
  } as CustomAxiosRequestConfig);
  return response.data;
};
