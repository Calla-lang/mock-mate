import type { PrismaClient, Api } from '@prisma/client';

export class ApiController {
    constructor(
        private prisma: PrismaClient
    ) {

    }

    async getApi(nickname: string): Promise<Api | null> {
        return this.prisma.api.findFirst({
            where: {

                nickname
            }
        })
    }

    async isApiPublic(nickname: string): Promise<{ public: boolean } | null> {
        return this.prisma.api.findFirst({
            where: {
                nickname: nickname,
            },
            select: {
                public: true,
            },
        })
    }
}
