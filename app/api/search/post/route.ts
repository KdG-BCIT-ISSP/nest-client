import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const searchPosts = async ({
  search_query,
  topic,
  tag,
  order_by,
  order,
}: {
  search_query?: string;
  topic?: string[];
  tag?: string[];
  order_by?: string;
  order?: string;
}) => {
  const response = await axiosInterceptor.get("/search/post", {
    params: {
      search_query,
      topic,
      tag,
      order_by,
      order,
    },
  } as CustomAxiosRequestConfig);

  return response.data;
};
