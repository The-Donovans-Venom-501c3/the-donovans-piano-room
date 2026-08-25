export interface notification {
    id: string;
    notificationTypeId?: string;
    messageTypeId?: string;
    title: string;
    description?: string;
    message?: string;
    date?: string;
    postedAt?: string;
    imageSrc?: string;
    actionTitle?: string;
    unread: boolean;
    status: "unread" | "read" | "deleted";
    timeAgo?: string;
    mainIndex?: number;
    [key: string]: any;
}