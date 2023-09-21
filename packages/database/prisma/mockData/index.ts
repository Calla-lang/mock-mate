import { IApi, IAuthModel, IReturnType, IUser } from "./interfaces"

export const bobReturnTypes: IReturnType[] = [
    {
        name: 'Cat',
        properties: [
            {
                name: 'name',
                type: 'name',
            }
        ]
    },
    {
        name: 'Dog',
        properties: [
            {
                name: 'name',
                type: 'name',
            }
        ]
    },
]

export const aliceReturnTypes: IReturnType[] = [
    {
        name: 'Weather Status',
        properties: [
            {
                name: 'date',
                type: 'date',
            },
            {
                name: 'temperature',
                type: 'number',
            },
            {
                name: 'humidity',
                type: 'number',
                value: '50'
            },
            {
                name: 'user',
                type: 'User',
                value: JSON.stringify({
                    createdAt: Date.now(),
                    name: "paddy",
                    email: "paddy@sciencemail.com"
                })
            }
        ]
    },
    {
        name: 'User',
        properties: [
            {
                name: 'createdAt',
                type: 'date',
                value: 'now'
            },
            {
                name: 'name',
                type: 'name',
                value: "paddy"
            },
            {
                name: 'email',
                type: 'email',
                value: "paddy@sciencemail.com"
            },
            {
                name: 'readings',
                type: 'Weather Status',
                isArray: 25
            },
        ]
    },
    {
        name: 'Profile',
        properties: [
            {
                name: 'createdAt',
                type: 'date'
            },
            {
                name: 'updatedAt',
                type: 'date',
                value: 'now'
            },
            {
                name: "username",
                type: "name"
            },
            {
                name: "user",
                type: "User"
            },
            {
                name: "address",
                type: "Address"
            }
        ]
    },
    {
        name: 'Address',
        properties: [
            {
                name: 'firstLine',
                type: 'string'
            },
            {
                name: 'secondLine',
                type: 'string'
            },
            {
                name: "country",
                type: "string"
            },
            {
                name: "postcode",
                type: "string"
            }
        ]
    }
]

// model AuthModel {
//     id     Int   @id @default(autoincrement())
//     type String @default("jwt")
//     primaryKey String @default("username")
//     primaryValue String @default("admin")
//     password String @default("$2b$10$1MzcSVXa0c6EYMPVc7RHNOxmUewHWGMeEFiO5CC5aX7ycZQeX0mn.")
    
//     apis   Api[]
//     user   User  @relation(fields: [userId], references: [id])
//     userId Int
//   }

const jwtAuthModel: IAuthModel = {
    type: "jwt",
    primaryKey: "username",
    primaryValue: "admin",
    password: "$2b$10$1MzcSVXa0c6EYMPVc7RHNOxmUewHWGMeEFiO5CC5aX7ycZQeX0mn."
}

const basicAuthModel: IAuthModel = {
    type: "basic",
    primaryKey: "username",
    primaryValue: "admin",
    password: "$2b$10$1MzcSVXa0c6EYMPVc7RHNOxmUewHWGMeEFiO5CC5aX7ycZQeX0mn."
}

const bearerAuthModel: IAuthModel = {
    type: "bearer",
    primaryKey: "username",
    primaryValue: "admin",
    password: "$2b$10$1MzcSVXa0c6EYMPVc7RHNOxmUewHWGMeEFiO5CC5aX7ycZQeX0mn."
}


const alicesApis: IApi[] = [
    {
        name: 'Weather Api',
        nickname: 'weather',
        authModel: basicAuthModel,
        endpoints: [
            {
                isArray: 25,
                path: "/current-weather",
                returnType: aliceReturnTypes.find(r => r.name === 'Weather Status')!
            }
        ]

    },
    {
        name: 'User Api',
        nickname: 'users',
        authModel: jwtAuthModel,
        endpoints: [
            {
                isArray: 0,
                path: "/paddy",
                returnType: aliceReturnTypes.find(r => r.name === 'User')!
            }
        ]

    },
    {
        name: 'Profile Api',
        nickname: 'user-profiles',
        authModel: bearerAuthModel,
        endpoints: [
            {
                isArray: 10,
                path: "/all",
                returnType: aliceReturnTypes.find(r => r.name === 'Profile')!
            }
        ]

    }
]

const bobsApis: IApi[] = [
    {
        name: 'Cats Api',
        nickname: 'cats',
        endpoints: [
            {
                isArray: 25,
                path: "/all",
                returnType: bobReturnTypes.find(r => r.name === 'Cat')!
            }
        ]

    },
    {
        name: 'Dogs Api',
        nickname: 'dogs',
        endpoints: [
            {
                isArray: 25,
                path: "/all",
                returnType: bobReturnTypes.find(r => r.name === 'Dog')!
            }
        ]

    },
]

export const alice: IUser = {
    username: 'alice',
    apis: alicesApis,
    subscription: "SOLO",
    password: "$2b$10$1MzcSVXa0c6EYMPVc7RHNOxmUewHWGMeEFiO5CC5aX7ycZQeX0mn."
}

export const bob: IUser = {
    username: 'bob',
    apis: bobsApis,
    subscription: "FREE",
    password: "$2b$10$1MzcSVXa0c6EYMPVc7RHNOxmUewHWGMeEFiO5CC5aX7ycZQeX0mn."
}


export const users = [
    {
        user: alice,
        userReturnTypes: aliceReturnTypes
    },
    {
        user: bob,
        userReturnTypes: bobReturnTypes
    }
]