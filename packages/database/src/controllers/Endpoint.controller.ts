import type { PrismaClient } from '@prisma/client';

export class EndpointController {

    constructor(
        private prisma: PrismaClient
    ) {

    }


    async getByPathAndNickname(nickname: string, path: string) {
        return this.prisma.endpoint.findFirst({
            where: {
                path: path.includes("/") ? path : `/${path}`,
                api: {
                    nickname: nickname,
                }
            },
            include: {
                api: {
                    include: {
                        user: {
                            include: {
                                returnTypes: {
                                    include: {
                                        properties: true
                                    }
                                }
                            }
                        }
                    }
                },
                returnType: {
                    include: {
                        properties: true,
                    }
                }
            }
        })
    }
}
