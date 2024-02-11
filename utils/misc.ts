


export const base64Decode = (str: string) => {
    return globalThis.atob(str);
}