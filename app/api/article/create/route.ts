import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const createArticle = async (
  title: string,
  content: string,
  topicId: number,
  type: string,
  tags: string[],
  images: string
) => {
  const response = await axiosInterceptor.post(
    "/article",
    {
      title: title,
      content: content,
      topicId: topicId,
      type: type,
      tagNames: tags,
      coverImage: images,
    },
    { requiresAuth: true } as CustomAxiosRequestConfig
  );
  return response.data;
};
