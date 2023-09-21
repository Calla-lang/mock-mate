import { Prisma } from "@prisma/client"

export type UserFull = Prisma.UserGetPayload<{
    include: {
        authModel: true,
        returnTypes: true,
        apis: true
    }
}>