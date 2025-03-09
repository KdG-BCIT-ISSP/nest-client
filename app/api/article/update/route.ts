import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const updateArticle = async (
  id: number,
  title: string,
  content: string,
  topicId: number,
  type: string,
  tags: string[],
  images: string
) => {
  const response = await axiosInterceptor.put(
    "/article",
    {
      id: id,
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
