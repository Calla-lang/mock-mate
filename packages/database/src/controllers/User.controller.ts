import { UserFull } from "defs";
import {PrismaClient} from "@prisma/client";

export class UserController {
    constructor(
        private prisma: PrismaClient
    ) {

    }

    async getFullUser(username: string): Promise<UserFull | null> {
        return await this.prisma.user.findFirst({
            where: {
                username: username
            },
            include: {
                authModel: true,
                returnTypes: true,
                apis: true,
            }
        })

    }

}