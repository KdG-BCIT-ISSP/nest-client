import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const deleteTopic = async (id: number) => {
  const response = await axiosInterceptor.delete(`/topic/delete/${id}`, {
    requiresAuth: true,
  } as CustomAxiosRequestConfig);
  return response.data;
};
