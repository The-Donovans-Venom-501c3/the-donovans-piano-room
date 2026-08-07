export interface notification {
    id?: string;
    title: string;
    description: string;
    actionTitle: string;
    date: Date;
    unread: boolean;
    imageSrc: string;
    timeAgo?: string;
    mainIndex?: number;
}