import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const createTag = async (name: string) => {
  const response = await axiosInterceptor.post(
    "/tag/create",
    {
      name: name,
    },
    { requiresAuth: true } as CustomAxiosRequestConfig
  );
  return response.data;
};
