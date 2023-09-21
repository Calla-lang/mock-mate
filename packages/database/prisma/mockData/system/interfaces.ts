export type IPermissionType = "FREE" | "SOLO" | "TEAM" | "ENTERPRISE" | "ADMIN";

export interface IPermissionLevel {
    levelName: IPermissionType;
    requestsPerSecond: number;
    apis: number
    endpoints: number
    returnTypes: number
    typeGeneration: boolean
    authTypes: boolean
}
