import axiosInterceptor, { CustomAxiosRequestConfig } from "../../axiosInterceptor";

export const createPost = async (title: string, content: string, type:string, tags:string[], coverImage: string) => {
    const response = await axiosInterceptor.post("/article", {
        "title": title,
        "content": content,
        "type": type,
        "tags": tags,
        "coverImage": coverImage
    }, { requiresAuth: true, } as CustomAxiosRequestConfig);
    return response.data;
};
