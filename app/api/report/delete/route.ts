import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const deleteReport = async (reportId: string) => {
  const response = await axiosInterceptor.get("/report", {
    requiresAuth: true,
    params: { reportId },
  } as CustomAxiosRequestConfig);
  return response.data;
};
