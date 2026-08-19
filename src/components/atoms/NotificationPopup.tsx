"use client";

import { beenTimeAgo, dummyNoticationsData } from "@/utils/general";
import Image from "next/image";
import { useEffect, useState } from "react";
import Button3 from "./Button3";
import Link from "next/link";
import CloseIcon from '@mui/icons-material/Close';

type EventDetails = {
    title: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
};

export default function NotificationPopup() {
    const item = dummyNoticationsData[0];
    const [timeAgo, setTimeAgo] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const { timeAgo } = beenTimeAgo(item.date);
        setTimeAgo(timeAgo);
    }, [item.date]);

    // Calendar Event Details
    const eventDetails: EventDetails = {
        title: item.title || "Live lessons with The Donovan",
        description: item.description || "Live lessons with The Donovan",
        location: "The Donovan's Piano Room",
        startDate: "20250318T180000Z",
        endDate: "20250318T190000Z",
    };

    const handleAddToCalendar = ({ title, description, location, startDate, endDate }: EventDetails) => {
        const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            title,
        )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
            description,
        )}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

        window.open(url, "_blank");
    };

    const handleDownloadICS = ({ title, description, location, startDate, endDate }: EventDetails) => {
        const domain = typeof window !== 'undefined' ? window.location.hostname : "TheDonovan'sPianoRoom";
        const uid = `${Date.now()}@${domain}`;
        const CRLF = "\r\n";

        const icsContent =
            "BEGIN:VCALENDAR" + CRLF +
            "VERSION:2.0" + CRLF +
            `PRODID:-//${domain}//EN` + CRLF +
            "BEGIN:VEVENT" + CRLF +
            `UID:${uid}` + CRLF +
            `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z` + CRLF +
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

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const isCalendarAction = item.actionTitle?.toLowerCase() === 'add to calendar';

    return (
        <div className="absolute w-[100vw] h-[100vh]">
            <div className='absolute z-50 right-[5%] top-[-2%] flex w-[35%] p-6 bg-[#FEF8EE] rounded-2xl mt-[2%] hover:bg-[#FBF5FF] border border-[#FCF0D8] hover:border-white shadow-[#AC7A2280] shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px]'>
                <div className='w-[5%]'>
                    <div className='relative w-[4.5vh] h-[4.5vh]'>
                        <Image src={item.imageSrc} fill alt='' />
                    </div>
                </div>
                <div className='w-[90%] ml-[4%] flex flex-col'>
                    <div className='flex justify-between items-center'>
                        <p className='text-2xl 3xl:text-3xl 4xl:text-4xl font-medium'>{item.title}</p>
                        <p className='text-lg 3xl:text-xl 4xl:text-2xl text-[#817676]'>{timeAgo}</p>
                    </div>
                    <div>
                        <p className='text-xl 3xl:text-2xl 4xl:text-3xl mt-[2%] w-[90%]'>{item.description}</p>
                        <div className="flex items-center gap-4 mt-[2%]">
                            {isCalendarAction ? (
                                <div
                                    className="relative inline-block text-left"
                                    style={{ minWidth: "160px", maxWidth: "220px" }}
                                    onBlur={handleClickOutside}
                                >
                                    <Button3
                                        text="Add to calendar"
                                        onClick={toggleDropdown}
                                    />

                                    {/* Calendar Dropdown */}
                                    {isOpen && (
                                        <div className="absolute mt-1 left-1/2 -translate-x-1/2 rounded z-40 py-2 divide-y divide-gray-100 w-full bg-primary-purple shadow-xl">
                                            <ul className="text-center text-sm 3xl:text-base text-white font-semibold">
                                                <li>
                                                    <Button3
                                                        text='Google Calendar'
                                                        onClick={() => {
                                                            handleAddToCalendar(eventDetails);
                                                            setIsOpen(false);
                                                        }}
                                                    />
                                                </li>
                                                <li>
                                                    <Button3
                                                        text='Download ICS'
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
                            ) : (
                                <Button3
                                    text={item.actionTitle}
                                    style={{
                                        width: item.actionTitle.length > 6 ? "28%" : "22%",
                                        height: "4.3vh"
                                    }}
                                />
                            )}

                            <Link href="/account/notifications" className="underline text-primary-purple text-xl 3xl:text-2xl 4xl:text-3xl font-semibold">
                                See all notifications
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="absolute top-[-6%] right-[-0.3%] bg-[#FEF8EE] hover:bg-[#FBF5FF] w-[4vh] h-[4vh] rounded-full border-2 border-[#FCF0D8] flex items-center justify-center select-none cursor-pointer">
                    <CloseIcon className="text-4xl 3xl:text-5xl 4xl:text-6xl text-primary-purple" />
                </div>
            </div>
        </div>
    );
}