import { ReturnProperty } from '@prisma/client'
import { generators } from '@mock-mate/generators'
import { ReturnTypesWithRelations } from '../../defs';
import { isFirstCharCapital } from '../../safeguards';
import { generateError } from '../../utils/responses';

const tryConvert = (propertyType: string, value: string) => {
    if (isFirstCharCapital(propertyType)) {
        propertyType = "class"
    }
    if (value === "now") {
        return generators['now']().toString() as string | number | boolean
    }
    switch (propertyType) {
        case "number":
            return parseInt(value)
        case "class":
            return JSON.parse(value)
        case "date":
            if (value === "now") {
                return generators['now']().toString() as string | number | boolean
            }
            return generators['date']().toString() as string | number | boolean
        default:
            return value
    }
}


export const getValue = (property: ReturnProperty, returnTypes: ReturnTypesWithRelations[], startType: string) => {
    if (property.value) {
        if (property.type !== "string") {
            return tryConvert(property.type, property.value)
        }
        return property.value
    } else if (isFirstCharCapital(property.type)) {
        if (property.type === startType) {
            return false
        }
        // console.log(property, returnTypes)
        const rType = returnTypes.find(rType => rType.name === property.type)
        if (!rType) {
            return generateError(`type ${property.type} not found`)
        }
        return generateObject(rType.properties, returnTypes, startType)
    } else if (!property.value) {
        // console.log(property.type)
        // @ts-expect-error
        return generators[property.type]() as string | number | boolean
    } else {
        return false
    }
}
export const generateObject = (properties: ReturnProperty[], returnTypes: ReturnTypesWithRelations[], startType:string) => {
    const obj: Record<string, any> = {}
    for (const property of properties) {
        // console.log(property.type, startType)
        if (property.type === startType) {
            continue
        } else {
            // console.log(property)
        }
        const value: any = property.isArray ? Array.from({ length: property.isArray }, () => getValue(property, returnTypes, startType)) : getValue(property, returnTypes, startType)
        if (value) {
            obj[property.name] = value
        }
    }
    return obj
}