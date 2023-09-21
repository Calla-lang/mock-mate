import { PrismaClient, ReturnType } from '@prisma/client';
import { users } from './mockData';
import { permissionLevels } from './mockData/system';

const prisma = new PrismaClient();

async function seed() {
    for (const level of permissionLevels) {
        await prisma.subscriptionLevel.upsert({
            where: { levelName: level.levelName },
            update: {},
            create: {
                levelName: level.levelName,
                requestsPerSecond: level.requestsPerSecond
            },
        });
    }

    for (const user of users) {
        const _user = user.user;
        const _returnTypes = user.userReturnTypes;

        const dbUser = await prisma.user.upsert({
            where: { username: _user.username },
            update: {},
            create: {
                username: _user.username,
                subscription: _user.subscription,
                password: _user.password
            },
        })
        const returnTypes: ReturnType[] = []

        for (const returnType of _returnTypes) {
            const dbReturnType: ReturnType = await prisma.returnType.upsert({
                where: {
                    name_userId: { name: returnType.name, userId: dbUser.id }
                },
                update: {},
                create: {
                    name: returnType.name, userId: dbUser.id
                },
            })

            for (const property of returnType.properties) {
                const dbReturnProperty = await prisma.returnProperty.upsert({
                    where: {
                        name_returnTypeId: { name: returnType.name, returnTypeId: dbReturnType.id }
                    },
                    update: {},
                    create: {
                        name: property.name,
                        type: property.type,
                        value: property.value ? property.value : undefined,
                        isArray: property.isArray ? property.isArray : 0,
                        returnTypeId: dbReturnType.id
                    },
                })
            }

            returnTypes.push(dbReturnType)
        }

        for (const api of _user.apis) {
            let authModel;
            if (api.authModel) {
                authModel = await prisma.authModel.upsert({
                    where: {
                        userId_type_primaryValue: {
                            userId: dbUser.id,
                            type: api.authModel.type,
                            primaryValue: api.authModel.primaryValue
                        }
                    },
                    update: {},
                    create: {
                        userId: dbUser.id,
                        type: api.authModel.type,
                        primaryKey: api.authModel.primaryKey,
                        primaryValue: api.authModel.primaryValue,
                        password: api.authModel.password
                    },
                })
            }
            const dbApi = await prisma.api.upsert({
                where: {
                    userId_nickname: { nickname: api.name, userId: dbUser.id }
                },
                update: {},
                create: {
                    name: api.name,
                    nickname: api.nickname,
                    userId: dbUser.id,
                    authModelId: authModel ? authModel.id : undefined

                },
            })


            for (const endpoint of api.endpoints) {
                const rType = returnTypes.find(x => x.name === endpoint.returnType?.name)
                if (rType) {
                    const dbEndpoint = await prisma.endpoint.upsert({
                        where: {
                            apiId_path: { path: endpoint.path, apiId: dbApi.id }
                        },
                        update: {},
                        create: {
                            path: endpoint.path,
                            apiId: dbApi.id,
                            returnTypeId: rType.id,
                            isArray: endpoint.isArray ? endpoint.isArray : 0,
                        },
                    })

                }
            }
        }
    }
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
