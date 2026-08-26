export const isGenericImage = (src?: string): boolean =>
    !src ||
    src.trim() === "" ||
    src.toLowerCase().includes("default") ||
    src.toLowerCase().includes("profile");

export const getNotificationImage = (
    typeId?: string | number,
    title?: string,
    description?: string,
    category?: string
): string => {
    const rawId = String(typeId || "").toUpperCase().trim();
    const textContext = `${title || ""} ${description || ""} ${category || ""}`.toLowerCase();

    // 1. Live Lessons / Upgrades / Memberships
    if (
        ["N01", "1", "LIVE_LESSON", "LIVE_LESSONS", "UPGRADE", "MEMBERSHIP"].includes(rawId) ||
        textContext.includes("live lesson") ||
        textContext.includes("membership") ||
        textContext.includes("upgrade") ||
        textContext.includes("black friday") ||
        textContext.includes("launching")
    ) {
        return "/ToBeRemoved/notification-icons/upgrade.svg";
    }

    // 2. Programs / Courses / Scholarships / Updates
    if (
        ["N02", "N03", "N04", "N05", "N06", "2", "3", "4", "5", "6", "PROGRAM", "COURSE", "SCHOLARSHIP"].includes(rawId) ||
        textContext.includes("scholarship") ||
        textContext.includes("program") ||
        textContext.includes("course") ||
        textContext.includes("enrolled") ||
        textContext.includes("enroll") ||
        textContext.includes("version") ||
        textContext.includes("launched") ||
        textContext.includes("update")
    ) {
        return "/ToBeRemoved/notification-icons/program.svg";
    }

    // 3. Fallback Profile Icon
    return "/ToBeRemoved/notification-icons/profile.svg";
};

export const resolveNotificationImage = (
    imageSrc: string | undefined,
    typeId: string | number | undefined,
    title: string | undefined,
    description: string | undefined,
    category: string | undefined
): string => {
    if (!isGenericImage(imageSrc)) {
        return imageSrc as string;
    }
    return getNotificationImage(typeId, title, description, category);
};