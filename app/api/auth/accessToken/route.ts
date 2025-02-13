import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const getNewAccessToken = async (refreshToken: string) => {
  const response = await axiosInterceptor.post(
    "/auth/getNewAccessToken",
    { refreshToken },
    {
      requiresAuth: true,
      headers: {
        "Content-Type": "application/json",
      },
    } as CustomAxiosRequestConfig
  );

  return response.data;
};
