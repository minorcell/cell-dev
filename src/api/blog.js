import request from "../utils/request";

export const uploadBlog = (blog) => {
    return request.post("/api/blog", blog)
}

export const getTypesServer = () => {
    return request.get("/api/blog/type")
}

export const getBlogsServer = ({ status, type, page, size }) => {
    return request.get("/api/blog", { params: { status: status, type: type, page: page, size: size } })
}

export const changeBlogStatusServer = ({ id, status }) => {
    return request.put("/api/blog", { id: id, status: status })
}

export const getBlogDetailServer = (id) => {
    return request.get(`/api/blog/${id}`)
}

export const updateBlogServer = (blog) => {
    return request.put("/api/blog", blog)
}

export const deleteBlogServer = (id) => {
    return request.delete(`/api/blog/${id}`)
}