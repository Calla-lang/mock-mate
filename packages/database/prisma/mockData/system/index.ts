import { IPermissionLevel } from "./interfaces";

export const permissionLevelFree: IPermissionLevel = {
    levelName: "FREE",
    requestsPerSecond: 5,
    apis: 1,
    endpoints: 3,
    returnTypes: 3,
    typeGeneration: false,
    authTypes: false
}

export const permissionLevelSolo: IPermissionLevel = {
    levelName: "SOLO",
    requestsPerSecond: 10,
    apis: 5,
    endpoints: 20,
    returnTypes: 20,
    typeGeneration: true,
    authTypes: true
}

export const permissionLevelTeam: IPermissionLevel = {
    levelName: "TEAM",
    requestsPerSecond: 10,
    apis: 20,
    endpoints: 100,
    returnTypes: 200,
    typeGeneration: true,
    authTypes: true
}

export const permissionLevelEnterprise: IPermissionLevel = {
    levelName: "ENTERPRISE",
    requestsPerSecond: 100,
    apis: 100,
    endpoints: 1000,
    returnTypes: 1000,
    typeGeneration: true,
    authTypes: true
}

export const permissionLevelAdmin: IPermissionLevel = {
    levelName: "ADMIN",
    requestsPerSecond: 10000,
    apis: 10000,
    endpoints: 10000,
    returnTypes: 10000,
    typeGeneration: true,
    authTypes: true
}

export const permissionLevels: IPermissionLevel[] = [
    permissionLevelFree,
    permissionLevelSolo,
    permissionLevelTeam,
    permissionLevelEnterprise,
    permissionLevelAdmin
];