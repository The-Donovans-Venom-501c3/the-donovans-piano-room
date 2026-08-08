"use client"
import AccountAndSettingsNav from "@/components/atoms/AccountAndSettingsNav";
import AuthorizedWrapper1 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper1";
import { authorizedWrapperTitles, beenTimeAgo, settingsNavigation } from "@/utils/general";
import { hasUnreadAtom, isNavOpenAtom, notificationsAtom } from "@/utils/stores";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
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

    // Track when client side hydration has completed
    const [isMounted, setIsMounted] = useState(false);

    const isNavOpen = useAtomValue(isNavOpenAtom);
    const setHasUnread = useSetAtom(hasUnreadAtom);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !notificationsList) return;

        const todays: notification[] = [];
        const past: notification[] = [];
        let count = 0;

        for (let item of notificationsList) {
            const { timeAgo, underADay } = beenTimeAgo(item.date);
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

    const updateNotification = (
        targetItem: notification,
        updateFn: (item: notification) => notification | null
    ) => {
        setNotificationsList((prevList) => {
            if (!prevList) return [];

            return prevList
                .map((item) => {
                    const isSameItem = targetItem.id 
                        ? item.id === targetItem.id 
                        : item.title === targetItem.title;

                    if (isSameItem) {
                        return updateFn(item);
                    }
                    return item;
                })
                .filter(Boolean) as notification[];
        });
    };

    const deleteItem = (targetItem: notification) => {
        updateNotification(targetItem, () => null);
    };

    const setItemToRead = (targetItem: notification) => {
        updateNotification(targetItem, (item) => ({ ...item, unread: false }));
    };

    // Prevent SSR / Client hydration mismatch
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
                </div>
            </div>
        </AuthorizedWrapper1>
    );
}