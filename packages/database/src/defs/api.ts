import { Prisma } from "@prisma/client"

export type ApiFull = Prisma.ApiGetPayload<{
    include: {
        authModel: true,
        user: true,
        endpoints: {
            include: {
                returnType: {
                    include: {
                        properties: true
                    }
                }
            }
        },
        usage: true
    }
}>

export type ApiWithAuth = Prisma.ApiGetPayload<{
    include: {
        authModel: true
    }
}>
export type ApiWithAuthAndUser = Prisma.ApiGetPayload<{
    include: {
        authModel: true,
        user: true
    }
}>

export type ApiWithAuthAndUserAndUsage = Prisma.ApiGetPayload<{
    include: {
        authModel: true,
        user: true,
        usage: true
    }
}>

export type ApiWithRelations = Prisma.ApiGetPayload<{
    include: {
        endpoints: {
            where: {
                path: string
            }
            include: {
                returnType: {
                    include: {
                        properties: true
                    }
                }
            }
        }
    }
}>

export type EndpointWithRelations = Prisma.EndpointGetPayload<{
    include: {
        returnType: {
            include: {
                properties: true
            }
        }
    }
}>

export type ReturnTypesWithRelations = Prisma.ReturnTypeGetPayload<{
    include: {
        properties: true
    }
}>
export type ApiSuccessData = ApiWithRelations | ReturnTypesWithRelations
export type ApiError = {
    status: boolean
    message: string
}

export type ApiSuccess = {
    status: boolean
    data: ApiSuccessData
}

export type ApiResponse = ApiSuccess | ApiError;


export type NewApiUsageRecord = { apiNickname: string; endpointPath: string; method: string; statusCode: number; responseTime: number; dataLength: number; ipAddress?: string; }