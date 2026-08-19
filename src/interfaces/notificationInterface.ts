export interface notification {
    id?: string;
    messageTypeId?: string; // Message type ID from the Notifications Master table (e.g., "N01")
    title: string;
    description: string;
    actionTitle: string;
    date: Date;
    unread: boolean;
    imageSrc: string;
    timeAgo?: string;
    mainIndex?: number;
}