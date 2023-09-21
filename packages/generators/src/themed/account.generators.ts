import { generateRandomNumber, generateRandomString } from "../common"


export const generateName = (name?: string) => `${name || generateRandomString()}@${generateRandomString()}.com`
export const generateEmail = (name?: string) => `${name || generateName()}@${generateRandomString()}.com`
export const generateTelephone = (format: "us" | "uk") => {
    switch (format) {
        case "us":
            return `+1${generateRandomNumber()}`
        case "uk":
            return `+44${generateRandomNumber()}`
        default:
            throw new Error("Invalid format")
    }
}
