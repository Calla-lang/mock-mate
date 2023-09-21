import { PrismaClient, ReturnType } from '@prisma/client';
import { alice, aliceReturnTypes } from './mockData';

const prisma = new PrismaClient();

async function seed() {
    const dbAlice = await prisma.user.upsert({
        where: { username: alice.username },
        update: {},
        create: {
            username: alice.username,
        },
    })
    const returnTypes: ReturnType[] = []
    for (const returnType of aliceReturnTypes) {
        const dbReturnType: ReturnType = await prisma.returnType.upsert({
            where: {
                name_userId: { name: returnType.name, userId: dbAlice.id }
            },
            update: {},
            create: {
                name: returnType.name, userId: dbAlice.id
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

    for (const api of alice.apis) {
        const dbApi = await prisma.api.upsert({
            where: {
                userId_nickname: { nickname: api.name, userId: dbAlice.id }
            },
            update: {},
            create: {
                name: api.name,
                nickname: api.nickname,
                userId: dbAlice.id
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

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
