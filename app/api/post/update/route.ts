import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const updatePost = async (
  id: number,
  memberId: number,
  title: string,
  content: string,
  topicId: number,
  type: string,
  tags: string[],
  images: string
) => {
  const requestData = {
    id,
    memberId,
    title,
    content,
    topicId,
    type,
    tags,
    images,
  };
  console.log("Request Data:", requestData);
  const response = await axiosInterceptor.put(
    "/posts",
    {
      id: id,
      memberId: memberId,
      title: title,
      content: content,
      type: type,
      topicId: topicId,
      tagNames: tags,
      imageBase64: images,
    },
    { requiresAuth: true } as CustomAxiosRequestConfig
  );
  return response.data;
};
