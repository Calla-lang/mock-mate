import { generateError } from "../../utils/responses";
import { ApiController, EndpointController, PrismaService, UserController } from "../../controllers";
import type { PrismaClient } from '@prisma/client';
import { generateObject } from "../../responder/object";
import { NewApiUsageRecord } from "../../defs";

export class Database {
    prisma: PrismaClient;
    apiController: ApiController;
    endPointController: EndpointController;
    userController: UserController;

    constructor() {
        this.prisma = PrismaService.getInstance()
        this.apiController = new ApiController(this.prisma)
        this.endPointController = new EndpointController(this.prisma)
        this.userController = new UserController(this.prisma)
    }


    async getIsApiPublic(nickname: string): Promise<boolean> {
        const isPublic = await this.apiController.isApiPublic(nickname)
        return !!isPublic?.authModelId ?? false
    }

    async getFulfilledApi(nickname: string, path: string) {
        const endpoint = await this.endPointController.getByPathAndNickname(nickname, path)
        if (!endpoint) {
            return generateError(`endpoint with ${path} for api ${nickname} not found`)
        }
        const api = endpoint.api;
        if (!api) {
            return generateError(`api with ${nickname} not found`)
        }

        const user = api.user;
        const returnTypes = user.returnTypes;
        if (!returnTypes) {
            return generateError(`returnTypes for ${nickname}/${path} not found`)
        }
        if (endpoint.returnType.properties.length === 0) {
            return generateError(`api from user ${api.userId} has no properties`)
        }
        try {
            const data = endpoint.isArray ? Array.from({ length: endpoint.isArray }, () => generateObject(endpoint.returnType.properties, returnTypes, endpoint.returnType.name)) : generateObject(endpoint.returnType.properties, returnTypes, endpoint.returnType.name)
            return {
                status: true,
                data: data
            }
        } catch (e) {
            console.error(e)
            throw e
        }
    }

    async addApiUsage(data: NewApiUsageRecord) {
        if (data.apiNickname) {
            const api = await this.prisma.api.findFirst({ where: { nickname: data.apiNickname } })
            if (!api) {
                return generateError(`api with id ${data.apiNickname} not found`)
            }
            const path = await this.prisma.endpoint.findFirst({ where: { path: data.endpointPath, apiId: api.id } })
            if (!path) {
                return generateError(`endpoint with id ${data.endpointPath} for api with id ${data.apiNickname} not found`)
            }
            await this.prisma.apiUsage.create({
                data: {
                    apiId: api.id,
                    endpointId: path.id,
                    method: data.method,
                    statusCode: data.statusCode,
                    responseTime: data.responseTime,
                    dataLength: data.dataLength,
                    ipAddress: data.ipAddress
                }
            })
        }
    }

    async getPermissionLevels() {
        return this.prisma.subscriptionLevel.findMany()
    }
}

export class DatabaseService {
    private static instance: Database;

    private constructor() {
        // Private constructor to prevent direct instantiation
    }

    public static getInstance(): Database {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new Database();
        }
        return DatabaseService.instance;
    }
}