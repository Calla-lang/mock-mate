import { generateRandomString, generateRandomNumber, generateRandomBoolean, generateCurrentDate, generateRandomDate } from "./common";
import { generateName, generateEmail, generateTelephone } from "./themed";


export const generators = {
    // common
    string: generateRandomString,
    number: generateRandomNumber,
    boolean: generateRandomBoolean,
    now: generateCurrentDate,
    date: generateRandomDate,

    // themed
    name: generateName,
    email: generateEmail,
    telephone: generateTelephone,
}

export * from './common';
export * from './themed';