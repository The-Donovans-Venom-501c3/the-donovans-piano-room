"use client"
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

// @ts-ignore: allow importing global css without type declarations
import "@/styles/primary-purple-scrollbar.css";

export default function Page() {
    const [notificationsList, setNotificationsList] = useAtom(notificationsAtom);
    const [displayedNotifications, setDisplayedNotifications] = useState<[notification[], notification[]]>([[], []]);
    const [filterMode, setFilterMode] = useState<"all" | "unread">("all");
    const [unreadsNumber, setUnreadsNumber] = useState(0);

    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const isNavOpen = useAtomValue(isNavOpenAtom);
    const setHasUnread = useSetAtom(hasUnreadAtom);

    // 1. Fetch user notifications from backend on mount
    const fetchNotifications = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/notifications");
            if (!res.ok) throw new Error("Failed to fetch notifications");
            
            const data = await res.json();
            
            // Map status field and normalize date key to 'date'
            const parsedData: notification[] = data
                .filter((item: any) => item.status !== "deleted")
                .map((item: any) => ({
                    ...item,
                    date: item.date || item.dateOfMessageAddition,
                    unread: item.status === "unread" || item.unread === true,
                }));

            setNotificationsList(parsedData);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setIsLoading(false);
        }
    }, [setNotificationsList]);

    useEffect(() => {
        setIsMounted(true);
        fetchNotifications();
    }, [fetchNotifications]);

    // 2. Derive today vs. past notifications and compute unread totals
    useEffect(() => {
        if (!isMounted || !notificationsList) return;

        const todays: notification[] = [];
        const past: notification[] = [];
        let count = 0;

        for (let item of notificationsList) {
            // Safeguard date parameter with fallback property access
            const notificationDate = item.date || (item as any).dateOfMessageAddition;
            const { timeAgo, underADay } = beenTimeAgo(notificationDate);
            
            if (item.unread) count += 1;

            const itemWithTime = { ...item, timeAgo };

            if (filterMode === "unread" && !item.unread) continue;

            if (underADay) {
                todays.push({ ...itemWithTime, mainIndex: todays.length });
            } else {
                past.push({ ...itemWithTime, mainIndex: past.length });
            }
        }

        setUnreadsNumber(count);
        setDisplayedNotifications([todays, past]);
    }, [notificationsList, filterMode, isMounted]);

    useEffect(() => {
        if (isMounted) {
            setHasUnread(unreadsNumber > 0);
        }
    }, [unreadsNumber, setHasUnread, isMounted]);

    const displayAll = () => setFilterMode("all");
    const filterUnreads = () => setFilterMode("unread");

    // 3. Handle Mark as Read with PATCH /api/notifications/:id/read
    const setItemToRead = async (targetItem: notification) => {
        if (!targetItem.unread) return;

        setNotificationsList((prevList) =>
            (prevList || []).map((item) =>
                item.id === targetItem.id ? { ...item, unread: false, status: "read" } : item
            )
        );

        try {
            const res = await fetch(`/api/notifications/${targetItem.id}/read`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error("Failed to mark notification as read");
        } catch (error) {
            console.error("Failed to sync read status to server:", error);
            fetchNotifications();
        }
    };

    // 4. Handle Delete with DELETE /api/notifications/:id
    const deleteItem = async (targetItem: notification) => {
        setNotificationsList((prevList) =>
            (prevList || []).filter((item) => item.id !== targetItem.id)
        );

        try {
            const res = await fetch(`/api/notifications/${targetItem.id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete notification");
        } catch (error) {
            console.error("Failed to delete notification on server:", error);
            fetchNotifications();
        }
    };

    if (!isMounted) {
        return null;
    }

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
                        <div className="mt-8 text-primary-brown font-medium">Loading notifications...</div>
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
                                            key={item.id ?? `today-${item.title}-${i}`}
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
                                            key={item.id ?? `past-${item.title}-${i}`}
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