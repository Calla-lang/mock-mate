import bcrypt from 'bcrypt'

export async function hashPassword(plainPassword: string) {
    try {
        const saltRounds = 10; // Number of rounds for key stretching
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw error;
    }
}

export async function verifyPassword(plainPassword: string, hashedPassword: string) {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        return match;
    } catch (error) {
        throw error;
    }
}