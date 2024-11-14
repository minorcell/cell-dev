import request from "../utils/request";

export const uploadBlog = (blog) => {
    return request.post("/api/blog", blog)
}

export const getTypesServer = () => {
    return request.get("/api/blog/type")
}