import request from "../utils/request";

export function loginServer(data) {
    return request.post("/api/user/login", data)
}