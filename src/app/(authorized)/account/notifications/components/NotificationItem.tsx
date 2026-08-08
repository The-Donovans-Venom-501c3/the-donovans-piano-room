import React, { useState } from 'react';
import { notification } from '../../../../../interfaces/notificationInterface';
import Image from 'next/image';
import Button4 from '@/components/atoms/Button4';

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
    const toggleDropdown = () => setDisplayDropdown((prev) => !prev);

    return (
        <div className="flex min-h-[18vh] w-full p-6 bg-[#FEF8EE] rounded-2xl mt-[2%] hover:bg-[#FBF5FF] border border-[#FCF0D8] hover:border-white shadow-[#AC7A2280] shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px]">
            {/* Unread Indicator */}
            <div className="w-[5%] flex items-center justify-center">
                {item.unread && <div className="w-[1.5vh] h-[1.5vh] bg-primary-purple rounded-full"></div>}
            </div>

            {/* Notification Icon */}
            <div className="w-[5%]">
                <div className="relative w-[4.5vh] h-[4.5vh]">
                    <Image src={item.imageSrc} fill alt="" />
                </div>
            </div>

            {/* Content & Options */}
            <div className="w-[90%] ml-[2%] flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-center">
                        <p className="text-2xl 3xl:text-3xl 4xl:text-4xl font-medium text-primary-brown">{item.title}</p>
                        <p className="text-lg 3xl:text-xl 4xl:text-2xl text-[#817676]">{item.timeAgo}</p>
                    </div>

                    <div className="flex justify-between items-start mt-[1%]">
                        <div className="w-[85%]">
                            <p className="text-xl 3xl:text-2xl 4xl:text-3xl text-[#5A4B43]">{item.description}</p>
                            <Button4
                                text={item.actionTitle}
                                style={{
                                    width: item.actionTitle.length > 6 ? "23%" : "17%",
                                    height: "4vh",
                                    marginTop: "2%"
                                }}
                            />
                        </div>

                        {/* Options Dropdown Area */}
                        <div className="relative">
                            <button
                                onClick={toggleDropdown}
                                className="w-[4vh] h-[4vh] rounded-full hover:bg-secondary-purple flex items-center justify-center transition-colors"
                            >
                                <div className="relative w-[3vh] h-[3vh]">
                                    <Image src="/account/notifications/options-icons.svg" fill alt="Options" />
                                </div>
                            </button>

                            {displayDropdown && (
                                <>
                                    {/* Invisible backdrop to dismiss dropdown on click outside */}
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
                                        <li
                                            className="p-4 hover:bg-[#F5E8FF] flex items-center gap-3 cursor-pointer text-[#4A3B32]"
                                            onClick={() => {
                                                toggleDropdown();
                                                itemIsRead();
                                            }}
                                        >
                                            <div className="relative w-[2vh] h-[2vh]">
                                                <Image src="/account/notifications/turn-off.svg" alt="" fill />
                                            </div>
                                            <p className="text-base font-medium">Turn off this notification type</p>
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