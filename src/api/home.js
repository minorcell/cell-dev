import request from "../utils/request"

export const getGithubInfo = () => {
    return request.get("/api/user")
}

export const getDashBoardServer = () => {
    return request.get("/api/dashboard")
}