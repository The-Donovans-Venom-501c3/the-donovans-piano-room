import Button3 from '@/components/atoms/Button3'
import { isNavOpenAtom } from '@/utils/stores'
import { useAtomValue } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function FirstLesson() {
    const isNavOpen = useAtomValue(isNavOpenAtom)
    const [isOpen, setIsOpen] = useState(false);

    type EventDetails = {
        title: string;
        description: string;
        location: string;
        startDate: string;
        endDate: string;
    };

    const handleAddToCalendar = ({
        title,
        description,
        location,
        startDate,
        endDate,
    }: EventDetails) => {
        const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            title,
        )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
            description,
        )}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

        window.open(url, "_blank");
    };

    const handleDownloadICS = ({
        title,
        description,
        location,
        startDate,
        endDate,
    }: EventDetails) => {
        const domain = window.location.hostname || "TheDonovan'sPianoRoom";
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

    const event = {
        title: "Live lessons with The Donovan",
        description:
            "Live lessons with The Donovan: Join our next live session on March 18, at 2:00 pm EST.",
        location: "The Donovan's Piano Room",
        startDate: "20250318T180000Z",
        endDate: "20250318T190000Z",
    };

    const handleClickOutside = (e: React.FocusEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsOpen(false);
        }
    }

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    }

    return (
        /* Fits 100% of parent container, clamped between min and max constraints */
        <div 
            className="relative w-full max-w-[1000px] min-w-[320px] aspect-[704/500] transition-all duration-300 mx-auto"
            style={{
                maxWidth: isNavOpen ? 'calc(100vw - 26vw)' : 'calc(100vw - 12vw)'
            }}
        >
            <div className="absolute w-[86%] h-[88%] z-30 left-[7%] top-[6%] flex flex-col justify-between">
                
                {/* Header Row */}
                <div className="flex justify-between select-none items-center mb-[1%]">
                    <div className="flex gap-3 items-center">
                        <span className="relative h-[3vh] w-[3vh] min-h-[20px] min-w-[20px]">
                            <Image src="/dashboard/book-icon.svg" fill alt=""/>
                        </span>
                        <Link href={{ pathname: "/lessons", query: { tab: "live-sessions" } }}>
                            <p className="text-primary-brown text-xl 3xl:text-2xl 4xl:text-3xl font-bold">Lessons</p>
                        </Link>
                    </div>
                    <div className="bg-[#FFEBD5] flex items-center px-3 py-1.5 rounded-xl gap-2">
                        <span className="relative h-[2.2vh] w-[2.2vh] min-h-[16px] min-w-[16px]">
                            <Image src="/dashboard/checkmark.svg" fill alt=""/>
                        </span>
                        <p className="text-primary-brown text-base 3xl:text-xl 4xl:text-2xl font-semibold">Every Monday and Thursday</p>
                    </div>
                </div>

                {/* Video Container */}
                <div className="w-full h-[58%] relative rounded-2xl overflow-hidden shadow-sm">
                    <iframe 
                        className="w-full h-full"  
                        src="https://www.youtube.com/embed/Mwt9f9H7dsE?si=D1HT7i873D3VgQ3B" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen
                    />
                </div>

                {/* Footer Section */}
                <div className="mt-[1.5%]">
                    <p className="text-primary-brown text-2xl 3xl:text-3xl 4xl:text-4xl font-bold mb-[1%]">
                        Live lessons with The Donovan
                    </p>
                    <div className="flex justify-between items-center gap-4">
                        <div>
                            <p className="text-primary-brown text-base 3xl:text-lg">Join our next live session on</p>
                            <p className="text-primary-brown text-xl 3xl:text-2xl font-bold">March 18, at 2:00 pm EST.</p>
                        </div>
                        
                        <div 
                            className="relative inline-block text-left"
                            style={{ minWidth: "160px", maxWidth: "220px" }}
                            onBlur={(e) => handleClickOutside(e)}
                        >
                            <Button3  
                                text={`Add to Calendar ${isOpen ? "▲" : "▼"}`}
                                onClick={toggleDropdown} 
                            />

                            {/* Dropdown Menu */}
                            {isOpen && (
                                <div className="absolute mt-1 left-1/2 -translate-x-1/2 rounded z-40 py-2 divide-y divide-gray-100 w-full bg-primary-purple shadow-xl">
                                    <ul className="text-center text-sm 3xl:text-base text-white font-semibold">
                                        <li>
                                            <Button3
                                                text='Google Calendar'
                                                onClick={() => { handleAddToCalendar(event); setIsOpen(false); }}
                                            />
                                        </li>
                                        <li>
                                            <Button3
                                                text='Download ICS'
                                                onClick={() => { handleDownloadICS(event); setIsOpen(false); }}
                                            />
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Image */}
            <div className="absolute inset-0 -z-10">
                <Image src="/dashboard/lesson-bg.svg" fill alt="" className="object-fill rounded-2xl"/>
            </div>
        </div>
    )
}