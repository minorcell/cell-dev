import request from "../utils/request";

export const uploadServer = (file) => {
    return request.post("/api/file/upload", file)
}