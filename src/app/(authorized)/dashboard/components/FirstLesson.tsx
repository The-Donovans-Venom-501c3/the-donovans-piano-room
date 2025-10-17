import Button3 from '@/components/atoms/Button3'
import { IsNavOpenAtom } from '@/utils/stores'
import { useAtomValue } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'


export default function FirstLesson() {
    const isNavOpen = useAtomValue(IsNavOpenAtom)
    const [isOpen, setIsOpen] = useState(false);

    type EventDetails = {
        title: string;
        description: string;
        location: string;
        startDate: string; // e.g., "20250318T180000Z"
        endDate: string; // e.g., "20250318T190000Z"
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
        a.download = `${title.replace(/\s+/g, "_")}.ics`; // filename based on title
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
        // Check if the newly focused element is outside the dropdown
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsOpen(false);
        }
    }

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    }

  return (
        <div className="relative aspect-[704/472] w-[45vw]" style={isNavOpen ? { width: "38vw" } : {}}>
            <div className="absolute w-[80%] h-[90%] z-30 left-[10%] top-[10%]">
                <div className="flex justify-between select-none mt-[4%] mb-[3%]">
                    <div className="flex gap-[10%] items-center">
                        <span className="relative h-[3vh] w-[3vh]"><Image src="/dashboard/book-icon.svg" fill alt=""/></span>
                        <Link href={{ pathname: "/lessons", query: { tab: "live-sessions" } }}>
                            <p className="text-primary-brown text-xl 3xl:text-2xl 4xl:text-3xl font-semibold">Lessons</p>
                        </Link>
                    </div>
                    <div className="bg-[#FFEBD5] flex items-center p-2 rounded-xl">
                        <span className="relative h-[2.3vh] w-[2.3vh]"><Image src="/dashboard/checkmark.svg" fill alt=""/></span>
                        <p className="text-primary-brown text-xl 3xl:text-2xl 4xl:text-3xl font-semibold ml-3">Every Monday and Thursday</p>
                    </div>
                </div>
                <iframe className="w-[100%] h-[47%]"  src="https://www.youtube.com/embed/Mwt9f9H7dsE?si=D1HT7i873D3VgQ3B" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                <p className="text-primary-brown text-2xl font-semibold mt-[4%] mb-[3%]">Live lessons with The Donovan</p>
                <div className="flex justify-between text-2xl 3xl:text-3xl 4xl:text-4xl h-[10%]">
                    <div>
                        <p className="">Join our next live session on</p>
                        <p className="font-semibold">March 18, at 2:00 pm EST.</p>
                    </div>
                    
                  <div className="relative inline-block text-left"
                      style={{ width: "30%", height: "80%" }}
                      onBlur={(e) => handleClickOutside(e)}
                  >
                      <Button3  text={`Add to Calendar ${isOpen ? "▲" : "▼"}`}
                                onClick={toggleDropdown} />

                      {/* Dropdown menu */}
                      {isOpen && (
                          <div className="absolute mt-1 left-1/2 -translate-x-1/2 rounded z-10 py-3 divide-y divide-gray-100 w-11/12 bg-primary-purple">
                              <ul
                                  className="text-center text-[12px] 3xl:text-2xl 4xl:text-3xl text-white font-semibold"
                              >
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
            <div className="absolute inset-0 -z-10">
                <Image src="/dashboard/lesson-bg.svg" fill alt="" className="object-cover"/>
            </div>
        </div>
    )
}
