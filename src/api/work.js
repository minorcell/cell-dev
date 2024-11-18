import request from "../utils/request";

export const createWorkServer = (data) => {
    return request.post("/api/work", data)
}

export const getWorksServer = ({ page, size }) => {
    return request.get("/api/work", { params: { page: page, size: size } })
}
export const getWorkDetailServer = (id) => {
    return request.get(`/api/work/${id}`)
}

export const updateWorkServer = (data) => {
    return request.put("/api/work", data)
}

export const deleteWorkServer = (id) => {
    return request.delete(`/api/work/${id}`)
}