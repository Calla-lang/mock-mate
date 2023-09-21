import { IPermissionType } from "./system/interfaces";

export interface IProperty {
    name: string;
    type: string;
    value?: string;
    isArray?: number;
}

export interface IReturnType {
    name: string;
    properties: IProperty[]
}

export interface IEndpoint {
    isArray: number;
    path: string;
    returnType: IReturnType
}

export interface IAuthModel {
    type: string;
    primaryKey: string;
    primaryValue: string;
    password: string;
}

export interface IApi {
    name: string;
    nickname: string;
    authModel?: IAuthModel;
    endpoints: IEndpoint[]
}

export interface IUser {
    username: string;
    password: string;
    apis: IApi[]
    subscription: IPermissionType;
}
