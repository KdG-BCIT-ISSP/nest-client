import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const changePassword = async (oldPassword: string, newPassword: string) => {
  const response = await axiosInterceptor.put(
    "/password/change",
    {
      oldPassword: oldPassword,
      newPassword: newPassword,
    },
    { requiresAuth: true } as CustomAxiosRequestConfig
  );
  return response.data;
};
