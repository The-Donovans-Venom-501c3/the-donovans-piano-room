import React, { useState, useEffect, useRef } from 'react'; 
import Card from '@/components/atoms/Card';
import Image from 'next/image';

function LiveSessionsComponent() {
    const [isSessionJoined, setIsSessionJoined] = useState(false);
    const [isStreamActive, setIsStreamActive] = useState(false);

    const isCurrentlyActive = () => {
        //const now = new Date();
        const now = new Date('2025-05-26T10:00:00-04:00');
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const hour = now.getHours();
        return (day === 1 || day === 4) && hour >= 9 && hour < 17; // Active Mon/Thu, 9 AM - 5 PM EDT
    };

    const handleJoinSession = () => {
        setIsSessionJoined(true);
        sessionStorage.setItem('sessionJoined', 'true');
    };

    useEffect(() => {
        // Reset sessionJoined on page load to ensure video is not shown after refresh
        sessionStorage.removeItem('sessionJoined');
        setIsSessionJoined(false);
        setIsStreamActive(isCurrentlyActive());
    }, []);

    return (
        <div className="flex flex-col items-start p-4 bg-[#F5E6FF]">
            <h2 className="text-4xl font-medium text-[#8B4513] mb-6">
                Live session
            </h2>

            {isSessionJoined ? (
                /*<div className="bg-white rounded-xl shadow-lg p-2 border-b-4 w-full max-w-6xl flex flex-col">
                <div className="bg-white rounded-xl shadow-lg p-2 border-b-4 w-full max-w-6xl flex flex-col">
                    <iframe
                        src={process.env.REACT_APP_LIVE_STREAM_URL || "https://www.youtube.com/embed/-MAPZS1mP6U"}
                        title="Live Session"
                        className="w-full h-[450px] rounded-lg"
                        allowFullScreen
                    ></iframe>
                </div>*/

                <div className="rounded-2xl cursor-pointer w-full flex flex-col">
                    <button onClick={()=>setIsSessionJoined(false)} className='self-start flex items-center mb-4'>
                        <Image src="/lessons/Videos/Left Chevron Arrow.svg" width="24" height="24" alt="back arrow" />
                        <span className="text-xl ml-2 text-purple-700 font-semibold" style={{ lineHeight: '24px' }}>Back</span>
                     </button>
                    <div className="relative w-full h-0 pb-[40%] rounded-lg overflow-hidden">
                        <iframe
                            src={process.env.REACT_APP_LIVE_STREAM_URL || "https://www.youtube.com/embed/-MAPZS1mP6U"}
                            //src={process.env.REACT_APP_LIVE_STREAM_URL || "https://www.youtube.com/embed/tRScKDcYxlk"}
                            title="Live Session"
                            className="absolute top-0 left-0 w-full h-full"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>

            ) : (

                <Card width={487} height={428}>
                    {isStreamActive ? (
                        <>
                            <div className="flex items-center justify-end text-lg text-pink-500 font-semibold mb-4 px-4">
                                {/*
                                <span className="flex items-center text-lg text-pink-500 font-semibold">
                                <span className="w-3 h-3 bg-pink-500 rounded-full mr-2"></span>
                                    Session in progress
                                </span>
                                */}
                                <span className="text-sm text-gray-600 bg-[#FFF5E1] px-3 py-1 rounded-full">
                                    Every Monday and Thursday
                                </span>
                            </div>
                        </>
                    ) : (
                            <span className="text-lg text-gray-500 font-semibold">
                            </span>
                    )}

                    <div className="relative mb-4">
                        <img
                            src="/journal-book/logo.svg"
                            alt="Piano Room"
                            className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
                            {/*icon or text overlay can be added here if needed*/ }
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold mt-2 text-gray-800">
                        Lesson 2 - The eighth note
                    </h3>
                    <p className="text-base text-gray-500 mt-2">
                        Donec sed tortor ut justo consectetur venenatis. Curabitur sed enim in diam porta congue.
                    </p>
                    <button
                        onClick={handleJoinSession}
                        className="mt-6 w-1/4 bg-purple-700 text-white text-lg font-semibold py-2 px-4 rounded-full hover:bg-purple-800 transition duration-300 ease-in-out"
                        disabled={isSessionJoined}
                    >
                        {isSessionJoined ? 'Joined' : 'Join session'}
                    </button>
                </Card>
            )}
        </div>
    );
}
export default LiveSessionsComponent;