import { useState, useEffect } from "react";
import Image from 'next/image'
import dayjs from 'dayjs'
import { profileAtom } from "@/utils/stores";
import { useAtomValue } from "jotai";
import SelectInput from '@/components/atoms/select-input-2';
import AvatarSelectPopup from "./AvatarSelectPopup";

const getStartOfMonth = (month: number, year: number) => {
    return dayjs(new Date(year, month, 1)).day();
};
const getDaysInMonth = (month: number, year: number): number => {
    return dayjs(new Date(year, month, 1)).daysInMonth();
};

const convertHighlightDaysToStreaks = (highlightedDays: string[]) => {
    const streaks = [];
    let streak: string[] = [];
    for (let i = 0; i < highlightedDays.length; i++) {
        if (streak.length === 0) {
            streak.push(highlightedDays[i]);
        } else {
            const prev = dayjs(streak[streak.length - 1]);
            const curr = dayjs(highlightedDays[i]);
            if (prev.add(1, 'day').isSame(curr)) {
                streak.push(highlightedDays[i]);
            } else {
                streaks.push(streak);
                streak = [highlightedDays[i]];
            }
        }
    }
    if (streak.length > 0) {
        streaks.push(streak);
    }
    return streaks;
};

const getDayClass = (date: string, streaks: string[][]) => {
    let isStreak = false;
    let isStart = false;
    let isEnd = false;

    streaks.forEach(streak => {
        if (streak.includes(date)) {
            isStreak = true;
            if (streak[0] === date) isStart = true;
            if (streak[streak.length - 1] === date) isEnd = true;
        }
    });

    const bgColor = isStreak ? 'bg-primary-orange' : 'transparent';
    const roundedClass = isStart && isEnd ? 'rounded-l-full rounded-r-full' : isStart ? 'rounded-l-full' : isEnd ? 'rounded-r-full' : '';

    return `px-4 py-3 3xl:px-5 3xl:py-4 4xl:px-6 4xl:py-5 text-center ${bgColor} ${roundedClass}`;
};

export default function Calender({ highlightedDays }: { highlightedDays: string[] }) {
    const streaks = convertHighlightDaysToStreaks(highlightedDays);
    const today = dayjs();

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const years = Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => (2000 + i).toString());

    const [selectedMonth, setSelectedMonth] = useState(months[today.month()]);
    const [selectedYear, setSelectedYear] = useState(today.year());

    const monthIndex = months.indexOf(selectedMonth);

    const profile = useAtomValue(profileAtom)
    const [avatar, setAvatar] = useState(profile.picture)
    const [selectingAvatar, setSelectingAvatar] = useState(false)
    const closeSelectingAvatar = () => {
        setSelectingAvatar(false)
    }

    return (
        <div className="w-[27%] bg-[#FFF2E5] p-6 rounded-3xl font-montserrat">
            {selectingAvatar && <AvatarSelectPopup avatar={avatar} setAvatar={setAvatar} closeSelectingAvatar={closeSelectingAvatar} />}
            <div className='flex justify-center'>
                <div className="relative flex justify-center mb-4 h-[8vh] w-[8vh]">
                    <Image src={profile.picture} fill alt="Default Profile Picture" />
                    <div className="absolute bottom-0 right-0 h-[3vh] w-[3vh]">
                        <Image className="cursor-pointer" src="/profile/Pencil.svg" fill alt="Edit Profile" onClick={() => setSelectingAvatar(true)} />
                    </div>
                </div>
            </div>
            <div className="text-center">
                <h2 className="text-4xl 3xl:text-5xl 4xl:text-6xl text-primary-brown">{profile.fullName}</h2>
                <a href="#" className="underline text-lg 3xl:text-xl 4xl:text-2xl text-primary-purple">Monthly Membership</a>
                <div className="mt-4 px-14 text-xl 3xl:text-2xl 4xl:text-3xl">
                    <div className="flex items-center justify-between">
                        <div className='flex items-center'>
                            <div className="relative w-[4.5vh] h-[4.5vh]">
                                <Image src="/profile/Book.svg" fill alt="Info" />
                            </div>
                            <p className="text-xl 3xl:text-2xl 4xl:text-3xl">Activity</p>
                        </div>
                        <p className="flex items-center h-12 text-xl 3xl:text-2xl 4xl:text-3xl">10h/week</p>
                    </div>
                    <div className="flex justify-between">
                        <div className='flex items-center'>
                            <div className="relative w-[4.5vh] h-[4.5vh]">
                                <Image src="/profile/Lightning.svg" fill alt="Info" />
                            </div>
                            <p className="text-xl 3xl:text-2xl 4xl:text-3xl">Longest Streak</p>
                        </div>
                        <p className="flex items-center h-12 text-xl 3xl:text-2xl 4xl:text-3xl">7 day</p>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex justify-center">
                <div className="text-sm grid grid-cols-2 gap-2 text-2xl 3xl:text-3xl 4xl:text-4xl w-[75%]">
                    <SelectInput label='month' name='month' onChange={(e: any) => setSelectedMonth(e.target.value)} options={months} value={selectedMonth.toString()} />
                    <SelectInput label='year' name='year' onChange={(e: any) => setSelectedYear(e.target.value)} options={years} value={selectedYear.toString()} />
                </div>
            </div>
            <div className="flex mt-4 inline-block justify-center">
                <table className="table-fixed bg-[#FEF8EE] py-4 px-2 3xl:py-5 3xl:px-3 4xl:py-6 4xl:px-4 border-separate border-spacing-y-1 border border-primary-brown rounded-[25px] 3xl:rounded-[30px] 4xl:rounded-[35px] w-40% text-xl 3xl:text-2xl 4xl:text-3xl">
                    <thead>
                        <tr>
                            {days.map((day, i) => (
                                <th key={i} className="px-5 py-1 3xl:px-7 3xl:py-2 4xl:px-9 4xl:py-3 text-center">{day.slice(0, 1)}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 6 }, (_, i) => (
                            <tr key={i}>
                                {Array.from({ length: 7 }, (_, j) => {
                                    const day = i * 7 + j - Number(getStartOfMonth(monthIndex, selectedYear));
                                    if (day < 0 || day >= getDaysInMonth(monthIndex, selectedYear)) {
                                        return <td key={j}></td>
                                    }
                                    const date = dayjs(new Date(selectedYear, monthIndex, day + 1))
                                        .format('YYYY-MM-DD');
                                    return (
                                        <td key={j} className={getDayClass(date, streaks)}>
                                            <div className="relative">
                                                {dayjs(date).isSame(dayjs(), 'day') ? (
                                                    <div className="inline-flex items-center justify-center rounded-full bg-[#f4e89d] w-11 h-11">
                                                        {day + 1}
                                                    </div>
                                                ) : (
                                                    <div>{day + 1}</div>
                                                )}
                                            </div>
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
