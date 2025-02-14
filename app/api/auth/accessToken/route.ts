import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const getNewAccessToken = async (refreshToken: string) => {
  const response = await axiosInterceptor.post(
    "/auth/getNewAccessToken",
    { refreshToken },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    } as CustomAxiosRequestConfig
  );

  return response.data;
};
