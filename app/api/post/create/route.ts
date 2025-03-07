import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const createPost = async (
  title: string,
  content: string,
  topicId: number,
  type: string,
  tags: string[],
  images: string[]
) => {
  const response = await axiosInterceptor.post(
    "/posts",
    {
      title: title,
      content: content,
      topicId: topicId,
      type: type,
      tagNames: tags,
      imageBase64: images,
    },
    { requiresAuth: true } as CustomAxiosRequestConfig
  );
  return response.data;
};
