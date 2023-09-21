import { ApiResponse, ApiError, ApiSuccess } from "../defs/api";

export function isApiError(obj: ApiResponse): obj is ApiError {
    return obj.status === false;
}
export function isApiSuccess(obj: ApiResponse): obj is ApiSuccess {
    return obj.status === true;
}