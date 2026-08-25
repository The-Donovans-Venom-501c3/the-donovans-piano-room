"use client";

import { beenTimeAgo } from "@/utils/general";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import Button3 from "./Button3";
import Link from "next/link";
import CloseIcon from '@mui/icons-material/Close';
import { useAtom } from "jotai";
import { notificationsAtom } from "@/utils/stores";
import { notification } from "@/interfaces/notificationInterface";

type EventDetails = {
    title: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
};

const LIVE_LESSON_TYPE_IDS = ["N01", "LIVE_LESSONS"];

// Formats JS Date object strictly into YYYYMMDDTHHMMSSZ for ICS / Google Calendar
const formatICSDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
};

// Safe runtime type guard to map status strings into the strict notification interface union
const parseStatus = (rawStatus: any): "unread" | "read" | "deleted" => {
    const s = String(rawStatus || "").toLowerCase();
    if (s === "read" || s === "deleted") return s;
    return "unread";
};

export default function NotificationPopup() {
    const [notifications] = useAtom(notificationsAtom);
    const [latestNotification, setLatestNotification] = useState<notification | null>(null);
    const [timeAgo, setTimeAgo] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Fetch latest notification if Jotai store is empty
    const fetchLatestNotification = useCallback(async () => {
        try {
            const res = await fetch("/api/notifications");
            if (!res.ok) return;
            const rawData = await res.json();
            const itemsArray = Array.isArray(rawData) ? rawData : (rawData.notifications || rawData.data || []);
            
            const activeItems = itemsArray.filter((i: any) => parseStatus(i.status) !== "deleted");
            if (activeItems.length > 0) {
                const topItem = activeItems[0];
                const typeId = String(topItem.notificationTypeId || topItem.notif_type_id || topItem.messageTypeId || "N03");
                
                const rawDate = topItem.postedAt || topItem.posted_at || topItem.date || new Date().toISOString();
                const validDate = isNaN(Date.parse(rawDate)) ? new Date().toISOString() : new Date(rawDate).toISOString();
                const itemStatus = parseStatus(topItem.status);

                setLatestNotification({
                    id: String(topItem.id || topItem.notification_id || "popup-1"),
                    notificationTypeId: typeId,
                    messageTypeId: typeId,
                    title: topItem.title || topItem.message_title || "Notification",
                    description: topItem.message || topItem.description || "",
                    message: topItem.message || topItem.description || "",
                    postedAt: validDate,
                    date: validDate,
                    status: itemStatus,
                    unread: itemStatus === "unread",
                    imageSrc: topItem.imageSrc || (typeId === "N01" ? "/account/notifications/live-lesson.svg" : "/account/notifications/announcement.svg")
                });
            }
        } catch (err) {
            console.error("Failed to fetch popup notification:", err);
        }
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        if (notifications && notifications.length > 0) {
            setLatestNotification(notifications[0]);
        } else {
            fetchLatestNotification();
        }
    }, [notifications, fetchLatestNotification, isMounted]);

    useEffect(() => {
        if (latestNotification?.date || latestNotification?.postedAt) {
            const targetDate = latestNotification.postedAt || latestNotification.date;
            const { timeAgo } = beenTimeAgo(targetDate!);
            setTimeAgo(timeAgo);
        }
    }, [latestNotification]);

    if (!isMounted || !isVisible || !latestNotification) return null;

    // Dynamic start/end dates for Google Calendar / ICS
    const rawDateVal = latestNotification.postedAt || latestNotification.date || Date.now();
    const eventDate = isNaN(Date.parse(String(rawDateVal))) ? new Date() : new Date(rawDateVal);
    
    const startDateISO = formatICSDate(eventDate);
    const endDateISO = formatICSDate(new Date(eventDate.getTime() + 60 * 60 * 1000));

    const eventDetails: EventDetails = {
        title: latestNotification.title || "Live lesson session",
        description: latestNotification.description || latestNotification.message || "Live lesson session",
        location: "The Donovan's Piano Room",
        startDate: startDateISO,
        endDate: endDateISO,
    };

    const handleAddToCalendar = ({ title, description, location, startDate, endDate }: EventDetails) => {
        const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            title
        )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
            description
        )}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

        window.open(url, "_blank");
    };

    const handleDownloadICS = ({ title, description, location, startDate, endDate }: EventDetails) => {
        const domain = typeof window !== 'undefined' ? window.location.hostname : "TheDonovansPianoRoom";
        const uid = `${Date.now()}@${domain}`;
        const CRLF = "\r\n";

        const icsContent =
            "BEGIN:VCALENDAR" + CRLF +
            "VERSION:2.0" + CRLF +
            `PRODID:-//${domain}//EN` + CRLF +
            "BEGIN:VEVENT" + CRLF +
            `UID:${uid}` + CRLF +
            `DTSTAMP:${formatICSDate(new Date())}` + CRLF +
            `SUMMARY:${title}` + CRLF +
            `DESCRIPTION:${description}` + CRLF +
            `LOCATION:${location}` + CRLF +
            `DTSTART:${startDate}` + CRLF +
            `DTEND:${endDate}` + CRLF +
            "END:VEVENT" + CRLF +
            "END:VCALENDAR" + CRLF;

        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title.replace(/\s+/g, "_")}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleClickOutside = (e: React.FocusEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsOpen(false);
        }
    };

    const activeTypeId = latestNotification.notificationTypeId || latestNotification.messageTypeId;
    const isLiveLesson = !!activeTypeId && LIVE_LESSON_TYPE_IDS.includes(activeTypeId);

    return (
        <div className="absolute w-[100vw] h-[100vh] pointer-events-none z-50">
            <div className="pointer-events-auto absolute right-[5%] top-[-2%] flex w-[35%] p-6 bg-[#FEF8EE] rounded-2xl mt-[2%] hover:bg-[#FBF5FF] border border-[#FCF0D8] hover:border-white shadow-[#AC7A2280] shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px]">
                <div className="w-[5%]">
                    <div className="relative w-[4.5vh] h-[4.5vh]">
                        <Image 
                            src={latestNotification.imageSrc || "/account/notifications/announcement.svg"} 
                            fill 
                            alt={latestNotification.title || "Notification"} 
                        />
                    </div>
                </div>
                <div className="w-[90%] ml-[4%] flex flex-col">
                    <div className="flex justify-between items-center">
                        <p className="text-2xl 3xl:text-3xl 4xl:text-4xl font-medium text-primary-brown">{latestNotification.title}</p>
                        <p className="text-lg 3xl:text-xl 4xl:text-2xl text-[#817676]">{timeAgo}</p>
                    </div>
                    <div>
                        <p className="text-xl 3xl:text-2xl 4xl:text-3xl mt-[2%] w-[90%] text-[#5A4B43]">
                            {latestNotification.description || latestNotification.message}
                        </p>
                        <div className="flex items-center gap-4 mt-[2%]">
                            {isLiveLesson ? (
                                <div
                                    className="relative inline-block text-left"
                                    style={{ minWidth: "160px", maxWidth: "220px" }}
                                    onBlur={handleClickOutside}
                                >
                                    <Button3
                                        text="Add to calendar"
                                        onClick={() => setIsOpen((prev) => !prev)}
                                    />

                                    {/* Calendar Dropdown */}
                                    {isOpen && (
                                        <div className="absolute mt-1 left-1/2 -translate-x-1/2 rounded z-40 py-2 divide-y divide-gray-100 w-full bg-primary-purple shadow-xl">
                                            <ul className="text-center text-sm 3xl:text-base text-white font-semibold">
                                                <li>
                                                    <Button3
                                                        text="Google Calendar"
                                                        onClick={() => {
                                                            handleAddToCalendar(eventDetails);
                                                            setIsOpen(false);
                                                        }}
                                                    />
                                                </li>
                                                <li>
                                                    <Button3
                                                        text="Download ICS"
                                                        onClick={() => {
                                                            handleDownloadICS(eventDetails);
                                                            setIsOpen(false);
                                                        }}
                                                    />
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ) : latestNotification.actionTitle ? (
                                <Button3
                                    text={latestNotification.actionTitle}
                                    style={{
                                        width: latestNotification.actionTitle.length > 6 ? "28%" : "22%",
                                        height: "4.3vh"
                                    }}
                                />
                            ) : null}

                            <Link href="/account/notifications" className="underline text-primary-purple text-xl 3xl:text-2xl 4xl:text-3xl font-semibold">
                                See all notifications
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Dismiss Popup */}
                <button 
                    type="button"
                    onClick={() => setIsVisible(false)}
                    className="absolute top-[-6%] right-[-0.3%] bg-[#FEF8EE] hover:bg-[#FBF5FF] w-[4vh] h-[4vh] rounded-full border-2 border-[#FCF0D8] flex items-center justify-center select-none cursor-pointer"
                >
                    <CloseIcon className="text-4xl 3xl:text-5xl 4xl:text-6xl text-primary-purple" />
                </button>
            </div>
        </div>
    );
}