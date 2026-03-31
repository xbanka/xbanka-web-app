export const shortenUid = (uid: string | undefined) => {
    if (!uid) return "";
    return uid.slice(0, 8)
}