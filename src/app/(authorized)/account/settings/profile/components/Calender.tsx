import { useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { profileAtom } from "@/utils/stores";
import { useAtomValue } from "jotai";
import SelectInput from "@/components/atoms/select-input-2";
import AvatarSelectPopup from "./AvatarSelectPopup";

/**
 * Get the weekday index for the first day of a month.
 * Sunday = 0, Monday = 1, ..., Saturday = 6
 */
const getStartOfMonth = (month: number, year: number) => {
    return dayjs(new Date(year, month, 1)).day();
};

/**
 * Get the number of days in a month.
 */
const getDaysInMonth = (month: number, year: number): number => {
    return dayjs(new Date(year, month, 1)).daysInMonth();
};

/**
 * Convert highlighted dates into consecutive streaks.
 *
 * Example:
 * [
 *   "2026-10-01",
 *   "2026-10-02",
 *   "2026-10-03",
 *   "2026-10-07"
 * ]
 *
 * becomes:
 *
 * [
 *   ["2026-10-01", "2026-10-02", "2026-10-03"],
 *   ["2026-10-07"]
 * ]
 */
const convertHighlightDaysToStreaks = (highlightedDays: string[]) => {
    const sortedDays = [...highlightedDays].sort(
        (a, b) => dayjs(a).valueOf() - dayjs(b).valueOf()
    );

    const streaks: string[][] = [];
    let streak: string[] = [];

    for (let i = 0; i < sortedDays.length; i++) {
        const currentDay = sortedDays[i];

        if (streak.length === 0) {
            streak.push(currentDay);
            continue;
        }

        const previousDay = dayjs(streak[streak.length - 1]);
        const currentDate = dayjs(currentDay);

        if (previousDay.add(1, "day").isSame(currentDate, "day")) {
            streak.push(currentDay);
        } else {
            streaks.push(streak);
            streak = [currentDay];
        }
    }

    if (streak.length > 0) {
        streaks.push(streak);
    }

    return streaks;
};

/**
 * Determine how each highlighted day should look.
 *
 * Start of streak  -> rounded left
 * End of streak    -> rounded right
 * Single-day streak -> rounded both sides
 */
const getDayClass = (date: string, streaks: string[][]) => {
    let isStreak = false;
    let isStart = false;
    let isEnd = false;

    streaks.forEach((streak) => {
        if (streak.includes(date)) {
            isStreak = true;

            if (streak[0] === date) {
                isStart = true;
            }

            if (streak[streak.length - 1] === date) {
                isEnd = true;
            }
        }
    });

    const bgColor = isStreak ? "bg-primary-orange" : "transparent";

    const roundedClass =
        isStart && isEnd
            ? "rounded-l-full rounded-r-full"
            : isStart
            ? "rounded-l-full"
            : isEnd
            ? "rounded-r-full"
            : "";

    return `
        px-2 py-2
        sm:px-3 sm:py-2
        lg:px-4 lg:py-3
        3xl:px-5 3xl:py-4
        4xl:px-6 4xl:py-5
        text-center
        ${bgColor}
        ${roundedClass}
    `;
};

export default function Calender({
    highlightedDays,
}: {
    highlightedDays: string[];
}) {
    const profile = useAtomValue(profileAtom);

    const [avatar, setAvatar] = useState(profile?.picture || "");
    const [selectingAvatar, setSelectingAvatar] = useState(false);

    const closeSelectingAvatar = () => {
        setSelectingAvatar(false);
    };

    /**
     * Convert highlighted activity days into streaks.
     */
    const streaks = convertHighlightDaysToStreaks(highlightedDays);

    /**
     * Current date.
     */
    const today = dayjs();

    /**
     * Calendar labels.
     */
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    /**
     * Years available in the dropdown.
     */
    const years = Array.from(
        { length: new Date().getFullYear() - 1999 },
        (_, i) => (2000 + i).toString()
    );

    /**
     * Default calendar selection is the current month/year.
     */
    const [selectedMonth, setSelectedMonth] = useState(
        months[today.month()]
    );

    const [selectedYear, setSelectedYear] = useState(today.year());

    /**
     * Convert selected month name into its numerical index.
     */
    const monthIndex = months.indexOf(selectedMonth);

    return (
        <div className="w-[27%] bg-[#FFF2E5] p-6 rounded-3xl font-montserrat flex flex-col items-center h-fit">
            {/* Avatar popup */}
            {selectingAvatar && (
                <AvatarSelectPopup
                    avatar={avatar}
                    setAvatar={setAvatar}
                    closeSelectingAvatar={closeSelectingAvatar}
                />
            )}

            {/* ================================
                PROFILE SECTION
            ================================= */}
            <div className="flex flex-col items-center text-center w-full">
                {/* Avatar */}
                <div className="relative flex justify-center mb-3 h-[8vh] w-[8vh]">
                    <Image
                        src={
                            profile?.picture ||
                            "/profile/Settings/Avatar default.svg"
                        }
                        fill
                        alt="Default Profile Picture"
                        className="rounded-full object-cover"
                    />

                    {/* Edit avatar button */}
                    <div className="absolute bottom-0 right-0 h-[3vh] w-[3vh] bg-white rounded-full p-1 shadow-md hover:scale-105 transition-transform cursor-pointer">
                        <Image
                            src="/profile/Pencil.svg"
                            fill
                            alt="Edit Profile"
                            onClick={() => setSelectingAvatar(true)}
                        />
                    </div>
                </div>

                {/* Profile name */}
                <h2 className="text-4xl 3xl:text-5xl 4xl:text-6xl text-primary-brown font-medium">
                    {profile?.fullName || ""}
                </h2>

                {/* Membership */}
                <a
                    href="#"
                    className="underline text-lg 3xl:text-xl 4xl:text-2xl text-primary-purple block mt-1"
                >
                    Monthly Membership
                </a>
            </div>

            {/* ================================
                ACTIVITY / STREAK INFORMATION
            ================================= */}
            <div className="mt-6 w-full px-2">
                <div className="text-xl 3xl:text-2xl 4xl:text-3xl">
                    {/* Activity */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                            <div className="relative w-[4.5vh] h-[4.5vh] mr-2">
                                <Image
                                    src="/profile/Book.svg"
                                    fill
                                    alt="Activity"
                                />
                            </div>

                            <p className="text-xl 3xl:text-2xl 4xl:text-3xl">
                                Activity
                            </p>
                        </div>

                        <p className="flex items-center h-12 text-xl 3xl:text-2xl 4xl:text-3xl">
                            10h/week
                        </p>
                    </div>

                    {/* Longest streak */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="relative w-[4.5vh] h-[4.5vh] mr-2">
                                <Image
                                    src="/profile/Lightning.svg"
                                    fill
                                    alt="Longest Streak"
                                />
                            </div>

                            <p className="text-xl 3xl:text-2xl 4xl:text-3xl">
                                Longest Streak
                            </p>
                        </div>

                        <p className="flex items-center h-12 text-xl 3xl:text-2xl 4xl:text-3xl">
                            7 day
                        </p>
                    </div>
                </div>
            </div>

            {/* ================================
                MONTH / YEAR SELECTORS
            ================================= */}
            <div className="mt-5 flex justify-center w-full">
                <div className="text-sm grid grid-cols-2 gap-2 text-2xl 3xl:text-3xl 4xl:text-4xl w-[85%]">
                    <SelectInput
                        label="month"
                        name="month"
                        onChange={(e: any) =>
                            setSelectedMonth(e.target.value)
                        }
                        options={months}
                        value={selectedMonth}
                    />

                    <SelectInput
                        label="year"
                        name="year"
                        onChange={(e: any) =>
                            setSelectedYear(Number(e.target.value))
                        }
                        options={years}
                        value={selectedYear.toString()}
                    />
                </div>
            </div>

            {/* ================================
                CALENDAR
            ================================= */}
            <div className="flex mt-5 justify-center w-full overflow-x-auto">
                <table
                    className="
                        table-fixed
                        bg-[#FEF8EE]
                        py-4 px-2
                        3xl:py-5 3xl:px-3
                        4xl:py-6 4xl:px-4
                        border-separate
                        border-spacing-y-1
                        border
                        border-primary-brown
                        rounded-[25px]
                        3xl:rounded-[30px]
                        4xl:rounded-[35px]
                        w-full
                        text-sm
                        lg:text-lg
                        3xl:text-2xl
                        4xl:text-3xl
                    "
                >
                    {/* Calendar header */}
                    <thead>
                        <tr>
                            {days.map((day, i) => (
                                <th
                                    key={i}
                                    className="
                                        px-1
                                        py-1
                                        sm:px-2
                                        3xl:px-7
                                        3xl:py-2
                                        4xl:px-9
                                        4xl:py-3
                                        text-center
                                    "
                                >
                                    {day.slice(0, 1)}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Calendar days */}
                    <tbody>
                        {Array.from({ length: 6 }, (_, weekIndex) => (
                            <tr key={weekIndex}>
                                {Array.from(
                                    { length: 7 },
                                    (_, dayIndex) => {
                                        /**
                                         * Calculate actual day number.
                                         */
                                        const day =
                                            weekIndex * 7 +
                                            dayIndex -
                                            getStartOfMonth(
                                                monthIndex,
                                                selectedYear
                                            );

                                        /**
                                         * Empty cells before the first day
                                         * or after the final day.
                                         */
                                        if (
                                            day < 0 ||
                                            day >=
                                                getDaysInMonth(
                                                    monthIndex,
                                                    selectedYear
                                                )
                                        ) {
                                            return <td key={dayIndex}></td>;
                                        }

                                        /**
                                         * Convert calendar day to YYYY-MM-DD.
                                         */
                                        const date = dayjs(
                                            new Date(
                                                selectedYear,
                                                monthIndex,
                                                day + 1
                                            )
                                        ).format("YYYY-MM-DD");

                                        const isToday = dayjs(date).isSame(
                                            today,
                                            "day"
                                        );

                                        return (
                                            <td
                                                key={dayIndex}
                                                className={getDayClass(
                                                    date,
                                                    streaks
                                                )}
                                            >
                                                <div className="relative flex justify-center">
                                                    {isToday ? (
                                                        <div
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                justify-center
                                                                rounded-full
                                                                bg-[#f4e89d]
                                                                w-8 h-8
                                                                sm:w-9 sm:h-9
                                                                lg:w-10 lg:h-10
                                                                3xl:w-11 3xl:h-11
                                                                4xl:w-12 4xl:h-12
                                                            "
                                                        >
                                                            {day + 1}
                                                        </div>
                                                    ) : (
                                                        <div>{day + 1}</div>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    }
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}