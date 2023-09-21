import { ApiError } from "../defs/api";


export const generateError = (message: string): ApiError => ({
    status: false,
    message
})