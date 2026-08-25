"use client";

import AccountAndSettingsNav from "@/components/atoms/AccountAndSettingsNav";
import AuthorizedWrapper1 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper1";
import { authorizedWrapperTitles, beenTimeAgo, settingsNavigation } from "@/utils/general";
import { hasUnreadAtom, isNavOpenAtom, notificationsAtom } from "@/utils/stores";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState, useCallback } from "react";
import AllOrUnread from "./components/AllOrUnread";
import AllCatchUp from "./components/AllCatchUp";
import { notification } from "@/interfaces/notificationInterface";
import NotificationItem from "./components/NotificationItem";

const getNotificationImage = (typeId?: string): string => {
    switch (typeId) {
        case "N01":
        case "LIVE_LESSONS":
            return "/account/notifications/live-lesson.svg";
        case "N02":
        case "N05":
        case "N06":
            return "/account/notifications/maintenance.svg";
        default:
            return "/account/notifications/announcement.svg";
    }
};

export default function Page() {
    const [notificationsList, setNotificationsList] = useAtom(notificationsAtom);
    const [displayedNotifications, setDisplayedNotifications] = useState<[notification[], notification[]]>([[], []]);
    const [filterMode, setFilterMode] = useState<"all" | "unread">("all");
    const [unreadsNumber, setUnreadsNumber] = useState(0);

    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const isNavOpen = useAtomValue(isNavOpenAtom);
    const setHasUnread = useSetAtom(hasUnreadAtom);

    // 1. Fetch & Parse Backend Data
    const fetchNotifications = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/notifications", { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            
            const rawData = await res.json();
            const itemsArray = Array.isArray(rawData) 
                ? rawData 
                : (rawData.notifications || rawData.data || []);

            const parsedData: notification[] = itemsArray
                .filter((item: any) => String(item.status || "").toLowerCase() !== "deleted")
                .map((item: any, index: number) => {
                    // Extract Primary Keys safely
                    const itemId = String(item.id || item.notification_id || item.notificationId || `notif-${index}`);
                    const messageTypeId = String(item.notificationTypeId || item.notif_type_id || item.messageTypeId || "N03");
                    
                    // Extract Content Fields
                    const titleText = item.title || item.message_title || item.Message_title || "Notification";
                    const descText = item.message || item.description || item.Message_content || item.message_content || "";
                    
                    // Safely normalize SQL ISO Timestamps
                    const rawDate = item.postedAt || item.posted_at || item.created_at || item.date || new Date().toISOString();
                    const validDate = isNaN(Date.parse(rawDate)) ? new Date().toISOString() : new Date(rawDate).toISOString();

                    const statusStr = String(item.status || "unread").toLowerCase();
                    const isUnread = statusStr === "unread";

                    return {
                        ...item,
                        id: itemId,
                        notificationTypeId: messageTypeId,
                        messageTypeId,
                        title: titleText,
                        description: descText,
                        message: descText,
                        date: validDate,
                        postedAt: validDate,
                        imageSrc: item.imageSrc || getNotificationImage(messageTypeId),
                        unread: isUnread,
                        status: isUnread ? "unread" : "read"
                    };
                });

            setNotificationsList(parsedData);
        } catch (error) {
            console.error("Error fetching backend notifications:", error);
        } finally {
            setIsLoading(false);
        }
    }, [setNotificationsList]);

    useEffect(() => {
        setIsMounted(true);
        fetchNotifications();
    }, [fetchNotifications]);

    // 2. Filter & Group Items Whenever List or Filter Changes
    useEffect(() => {
        if (!isMounted || !Array.isArray(notificationsList)) return;

        const todays: notification[] = [];
        const past: notification[] = [];
        let unreadCounter = 0;

        for (let item of notificationsList) {
            if (item.unread) unreadCounter += 1;
            if (filterMode === "unread" && !item.unread) continue;

            const notificationDate = item.postedAt || item.date || item.posted_at || new Date().toISOString();
            const { timeAgo, underADay } = beenTimeAgo(notificationDate);
            const itemWithTime = { ...item, timeAgo };

            if (underADay) {
                todays.push({ ...itemWithTime, mainIndex: todays.length });
            } else {
                past.push({ ...itemWithTime, mainIndex: past.length });
            }
        }

        setUnreadsNumber(unreadCounter);
        setHasUnread(unreadCounter > 0);
        setDisplayedNotifications([todays, past]);
    }, [notificationsList, filterMode, isMounted, setHasUnread]);

    const displayAll = () => setFilterMode("all");
    const filterUnreads = () => setFilterMode("unread");

    // 3. Handle Mark as Read
    const setItemToRead = async (targetItem: notification) => {
        if (!targetItem.unread) return;
        const targetId = targetItem.id;

        setNotificationsList((prevList) =>
            (prevList || []).map((item) =>
                item.id === targetId ? { ...item, unread: false, status: "read" } : item
            )
        );

        try {
            const res = await fetch(`/api/notifications/${targetId}/read`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error("Failed to update status on server");
        } catch (error) {
            console.error("Failed to mark notification read:", error);
            fetchNotifications();
        }
    };

    // 4. Handle Delete
    const deleteItem = async (targetItem: notification) => {
        const targetId = targetItem.id;

        setNotificationsList((prevList) =>
            (prevList || []).filter((item) => item.id !== targetId)
        );

        try {
            const res = await fetch(`/api/notifications/${targetId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete item on server");
        } catch (error) {
            console.error("Failed to delete notification:", error);
            fetchNotifications();
        }
    };

    if (!isMounted) return null;

    return (
        <AuthorizedWrapper1 pageTitle={authorizedWrapperTitles.AccountAndSettings} openedLink="">
            <AccountAndSettingsNav currentPage={settingsNavigation.notification} />
            <div className="overflow-y-auto relative h-[88%]" style={{ width: isNavOpen ? "76.6vw" : "85vw" }}>
                <div className="w-[60%] h-full mt-[1%]">
                    <h2 className="text-5xl 3xl:text-6xl 4xl:text-7xl text-primary-brown font-montserrat font-medium mt-[3vh]">
                        Notifications
                    </h2>
                    <AllOrUnread unreadsNumber={unreadsNumber} displayAll={displayAll} filterUnreads={filterUnreads} />

                    {isLoading ? (
                        <div className="mt-8 text-primary-brown font-medium text-xl">Loading notifications...</div>
                    ) : (
                        <>
                            {!!displayedNotifications[0].length && (
                                <>
                                    <h5 className="text-primary-brown text-2xl 3xl:text-3xl 4xl:text-4xl font-medium mt-[2%]">
                                        Today ({displayedNotifications[0].length})
                                    </h5>
                                    {displayedNotifications[0].map((item, i) => (
                                        <NotificationItem
                                            item={item}
                                            key={item.id ?? `today-${i}`}
                                            deleteItem={() => deleteItem(item)}
                                            itemIsRead={() => setItemToRead(item)}
                                        />
                                    ))}
                                </>
                            )}

                            {!!displayedNotifications[1].length && (
                                <>
                                    <h5 className="text-primary-brown text-2xl 3xl:text-3xl 4xl:text-4xl font-medium mt-[2%]">
                                        Past notifications ({displayedNotifications[1].length})
                                    </h5>
                                    {displayedNotifications[1].map((item, i) => (
                                        <NotificationItem
                                            item={item}
                                            key={item.id ?? `past-${i}`}
                                            deleteItem={() => deleteItem(item)}
                                            itemIsRead={() => setItemToRead(item)}
                                        />
                                    ))}
                                </>
                            )}

                            {!displayedNotifications[0].length && !displayedNotifications[1].length && <AllCatchUp />}
                        </>
                    )}
                </div>
            </div>
        </AuthorizedWrapper1>
    );
}