import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const forgotPassword = async (email: string) => {
  const response = await axiosInterceptor.post(
    "/password/forgot",
    {
      email: email,
    },
    { requiresAuth: true } as CustomAxiosRequestConfig
  );
  return response.data;
};
