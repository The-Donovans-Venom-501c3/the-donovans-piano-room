'use client';

import React, { useState } from 'react';
import { notification } from '@/interfaces/notificationInterface';
import Image from 'next/image';
import Button4 from '@/components/atoms/Button4';

type EventDetails = {
    title: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
};

const LIVE_LESSON_MESSAGE_TYPE_IDS = ["N01", "LIVE_LESSONS"];

const formatICSDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
};

function renderFormattedDescription(description?: string) {
    if (!description) return "";
    const dateTimeRegex = /([A-Z][a-z]+\s+\d{1,2}(?:st|nd|rd|th)?,\s+at\s+\d{1,2}:\d{2}\s*(?:am|pm)\s*[A-Z0-9\+-]{2,5})/i;
    const parts = description.split(dateTimeRegex);

    return parts.map((part, index) => {
        if (dateTimeRegex.test(part)) {
            return (
                <strong key={index} className="font-bold text-primary-brown">
                    {part}
                </strong>
            );
        }
        return part;
    });
}

export default function NotificationItem({
    item,
    deleteItem,
    itemIsRead
}: {
    item: notification;
    deleteItem: () => void;
    itemIsRead: () => void;
}) {
    const [displayDropdown, setDisplayDropdown] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const toggleDropdown = () => setDisplayDropdown((prev) => !prev);
    const toggleCalendar = () => setIsCalendarOpen((prev) => !prev);

    const rawDateVal = item.postedAt || item.date || Date.now();
    const eventDate = isNaN(Date.parse(String(rawDateVal))) ? new Date() : new Date(rawDateVal);
    
    const startDateISO = formatICSDate(eventDate);
    const endDateISO = formatICSDate(new Date(eventDate.getTime() + 60 * 60 * 1000));

    const eventDetails: EventDetails = {
        title: item.title || "Live Lesson",
        description: item.description || item.message || "Live Lesson Announcement",
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

    const activeTypeId = item.notificationTypeId || item.messageTypeId;
    const isLiveLessonNotification = !!activeTypeId && LIVE_LESSON_MESSAGE_TYPE_IDS.includes(activeTypeId);

    return (
        <div className="flex min-h-[18vh] w-full p-6 bg-[#FEF8EE] rounded-2xl mt-[2%] hover:bg-[#FBF5FF] border border-[#FCF0D8] hover:border-white shadow-[#AC7A2280] shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px]">
            <div className="w-[5%] flex items-center justify-center">
                {item.unread && <div className="w-[1.5vh] h-[1.5vh] bg-primary-purple rounded-full"></div>}
            </div>

            <div className="w-[5%]">
                <div className="relative w-[4.5vh] h-[4.5vh]">
                    <Image 
                        src={item.imageSrc || "/ToBeRemoved/notification-icons/profile.svg"} 
                        fill 
                        alt={item.title || "Notification"} 
                    />
                </div>
            </div>

            <div className="w-[90%] ml-[2%] flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-center">
                        <p className="text-2xl 3xl:text-3xl 4xl:text-4xl font-medium text-primary-brown">{item.title}</p>
                        <p className="text-lg 3xl:text-xl 4xl:text-2xl text-[#817676]">{item.timeAgo}</p>
                    </div>

                    <div className="flex justify-between items-start mt-[1%]">
                        <div className="w-[85%]">
                            <p className="text-xl 3xl:text-2xl 4xl:text-3xl text-[#5A4B43]">
                                {renderFormattedDescription(item.description || item.message)}
                            </p>
                            
                            {isLiveLessonNotification ? (
                                <div className="relative inline-block text-left mt-[2%]">
                                    <button
                                        type="button"
                                        onClick={toggleCalendar}
                                        className="bg-[#7128A6] text-white font-semibold py-2 px-6 rounded-full text-lg shadow-md hover:bg-[#5c2088] transition-colors"
                                    >
                                        Add to calendar
                                    </button>

                                    {isCalendarOpen && (
                                        <>
                                            <div className="fixed inset-0 z-30" onClick={() => setIsCalendarOpen(false)} />
                                            <div className="absolute left-0 mt-2 w-[180px] bg-[#7128A6] rounded-xl z-40 py-2 shadow-xl">
                                                <button
                                                    type="button"
                                                    className="w-full text-left px-4 py-2 text-white font-medium hover:bg-[#5c2088] transition-colors text-sm"
                                                    onClick={() => {
                                                        handleAddToCalendar(eventDetails);
                                                        setIsCalendarOpen(false);
                                                    }}
                                                >
                                                    Google Calendar
                                                </button>
                                                <button
                                                    type="button"
                                                    className="w-full text-left px-4 py-2 text-white font-medium hover:bg-[#5c2088] transition-colors text-sm"
                                                    onClick={() => {
                                                        handleDownloadICS(eventDetails);
                                                        setIsCalendarOpen(false);
                                                    }}
                                                >
                                                    Download ICS
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : item.actionTitle ? (
                                <Button4
                                    text={item.actionTitle}
                                    style={{
                                        width: item.actionTitle.length > 6 ? "23%" : "17%",
                                        height: "4vh",
                                        marginTop: "2%"
                                    }}
                                />
                            ) : null}
                        </div>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={toggleDropdown}
                                className="w-[4vh] h-[4vh] rounded-full hover:bg-secondary-purple flex items-center justify-center transition-colors"
                            >
                                <div className="relative w-[3vh] h-[3vh]">
                                    <Image src="/account/notifications/options-icons.svg" fill alt="Options" />
                                </div>
                            </button>

                            {displayDropdown && (
                                <>
                                    <div className="fixed inset-0 z-20" onClick={toggleDropdown} />

                                    <ul className="absolute right-0 top-[4.5vh] z-30 w-[260px] bg-[#FEF8EE] border border-[#FCF0D8] text-lg rounded-xl shadow-lg select-none overflow-hidden">
                                        <li
                                            className="p-4 hover:bg-[#F5E8FF] flex items-center gap-3 cursor-pointer text-[#4A3B32]"
                                            onClick={() => {
                                                toggleDropdown();
                                                itemIsRead();
                                            }}
                                        >
                                            <div className="relative w-[2vh] h-[2vh]">
                                                <Image src="/account/notifications/mark-as-read.svg" alt="" fill />
                                            </div>
                                            <p className="text-base font-medium">Mark as read</p>
                                        </li>
                                        <li
                                            className="p-4 hover:bg-[#F5E8FF] flex items-center gap-3 cursor-pointer text-[#4A3B32]"
                                            onClick={() => {
                                                toggleDropdown();
                                                deleteItem();
                                            }}
                                        >
                                            <div className="relative w-[2vh] h-[2vh]">
                                                <Image src="/about/membership/Icon-doesnt-include.svg" alt="" fill />
                                            </div>
                                            <p className="text-base font-medium">Delete this notification</p>
                                        </li>
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}