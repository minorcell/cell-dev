import request from "../utils/request";

export const getBotServer = () => {
    return request.get("/api/bot")
}

export const updateBotServer = (data) => {
    return request.put("/api/bot", data)
}