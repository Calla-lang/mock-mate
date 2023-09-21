export const isFirstCharCapital = (str: string): boolean=> {
    if (!str) return false;  // Check for empty or null string
    const firstChar = str.charAt(0);
    return firstChar === firstChar.toUpperCase() && firstChar !== firstChar.toLowerCase();
}