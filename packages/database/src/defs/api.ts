import { Prisma } from "@prisma/client"

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
