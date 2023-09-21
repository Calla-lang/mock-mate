interface IProperty {
    name: string;
    type: string;
    value?: string;
    isArray?: number;
}

interface IReturnType {
    name: string;
    properties: IProperty[]
}

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
    }
]

interface IEndpoint {
    isArray: number;
    path: string;
    returnType: IReturnType
}

interface IApi {
    name: string;
    nickname: string;
    public: boolean;
    endpoints: IEndpoint[]
}

interface IUser {
    username: string;
    apis: IApi[]
}

const alicesApis: IApi[] = [
    {
        name: 'Weather Api',
        nickname: 'weather',
        public: true,
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
        public: true,
        endpoints: [
            {
                isArray: 0,
                path: "/paddy",
                returnType: aliceReturnTypes.find(r => r.name === 'User')!
            }
        ]

    }
]

export const alice: IUser = {
    username: 'alice',
    apis: alicesApis
}
