import axiosInterceptor, { CustomAxiosRequestConfig } from "../../axiosInterceptor";

export const createPost = async (title: string, content: string, topicId: number, type: string, tags: string[], coverImage: string) => {
    const requestData = { title, content, topicId, type, tags, coverImage };
    console.log("Request Data:", requestData);
    const response = await axiosInterceptor.post("/article", {
        "title": title,
        "content": content,
        "topicId": topicId,
        "type": type,
        "tagNames": tags,
        "coverImage": coverImage
    }, { requiresAuth: true, } as CustomAxiosRequestConfig);
    return response.data;
};
