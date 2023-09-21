import type { PrismaClient, Api } from '@prisma/client';
import { ApiFull, ApiWithAuthAndUser, ApiWithAuthAndUserAndUsage } from '../defs';

type ApiWithUsage = ApiWithAuthAndUserAndUsage;
type ApiWithoutUsage = ApiWithAuthAndUser;

interface ApiOptions {
    withUsage: true;
}

interface ApiOptionsWithoutUsage {
    withUsage?: false;
}

export class ApiController {
    constructor(
        private prisma: PrismaClient
    ) {

    }

    async getFullApi(id: string):Promise<ApiFull | null> {
        const api = await this.prisma.api.findFirst({
            where: {
                id: parseInt(id)
            },
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
        });
        if (!api) {
            return null;
        }
        return api;
    }

    async getApi(nickname: string, options: ApiOptions): Promise<ApiWithUsage | null>;
    async getApi(nickname: string, options?: ApiOptionsWithoutUsage): Promise<ApiWithoutUsage | null>;
    async getApi(nickname: string, options?: ApiOptions | ApiOptionsWithoutUsage): Promise<ApiWithUsage | ApiWithoutUsage | null> {
        const withUsage = options?.withUsage ?? false;

        if (withUsage) {
            const currentTime = new Date();
            const oneSecondAgo = new Date(currentTime.getTime() - 1000); // 1000 milliseconds = 1 second

            return this.prisma.api.findFirst({
                where: {
                    nickname
                },
                include: {
                    authModel: true,
                    user: true,
                    usage: {
                        where: {
                            timestamp: {
                                gte: oneSecondAgo,
                                lte: currentTime,
                            },
                        }
                    }
                }
            });
        } else {
            return this.prisma.api.findFirst({
                where: {
                    nickname
                },
                include: {
                    authModel: true,
                    user: true
                }
            });
        }
    }

    async isApiPublic(nickname: string): Promise<{ authModelId: number | null } | null> {
        return this.prisma.api.findFirst({
            where: {
                nickname: nickname,
            },
            select: {
                authModelId: true
            },
        })
    }
}
