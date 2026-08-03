"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Image from "next/image";

interface LiveSessionsComponentProps {
  searchQuery?: string;
}

export default function LiveSessionsComponent({
  searchQuery = "",
}: LiveSessionsComponentProps) {
  const [isSessionJoined, setIsSessionJoined] = useState(false);
  const [isStreamActive, setIsStreamActive] = useState(false);

  const sessionDetails = {
    title: "Lesson 2 - The eighth note",
    description:
      "Donec sed tortor ut justo consectetur venenatis. Curabitur sed enim in diam porta congue.",
  };

  const q = searchQuery.toLowerCase().trim();

  // Search filter matching title or description
  const isMatch =
    !q ||
    sessionDetails.title.toLowerCase().includes(q) ||
    sessionDetails.description.toLowerCase().includes(q);

  const isCurrentlyActive = () => {
    const now = new Date("2025-05-26T10:00:00-04:00");
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hour = now.getHours();
    return (day === 1 || day === 4) && hour >= 9 && hour < 17; // Active Mon/Thu, 9 AM - 5 PM EDT
  };

  const handleJoinSession = () => {
    setIsSessionJoined(true);
    sessionStorage.setItem("sessionJoined", "true");
  };

  useEffect(() => {
    sessionStorage.removeItem("sessionJoined");
    setIsSessionJoined(false);
    setIsStreamActive(isCurrentlyActive());
  }, []);

  return (
    <div className="flex flex-col items-start p-4 bg-[#F5E6FF] w-full rounded-2xl">
      <h2 className="text-4xl font-medium text-[#8B4513] mb-6">Live session</h2>

      {!isMatch ? (
        <div className="w-full text-center py-12 text-gray-500 font-medium text-lg">
          No live sessions found matching &quot;{searchQuery}&quot;
        </div>
      ) : isSessionJoined ? (
        <div className="rounded-2xl cursor-pointer w-full flex flex-col">
          <button
            onClick={() => setIsSessionJoined(false)}
            className="self-start flex items-center mb-4"
          >
            <Image
              src="/lessons/Videos/Left Chevron Arrow.svg"
              width="24"
              height="24"
              alt="back arrow"
            />
            <span
              className="text-xl ml-2 text-purple-700 font-semibold"
              style={{ lineHeight: "24px" }}
            >
              Back
            </span>
          </button>
          <div className="relative w-full h-0 pb-[40%] rounded-lg overflow-hidden">
            <iframe
              src={
                process.env.REACT_APP_LIVE_STREAM_URL ||
                "https://www.youtube.com/embed/-MAPZS1mP6U"
              }
              title="Live Session"
              className="absolute top-0 left-0 w-full h-full"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      ) : (
        <Card width={487} height={428}>
          {isStreamActive ? (
            <div className="flex items-center justify-end text-lg text-pink-500 font-semibold mb-4 px-4">
              <span className="text-sm text-gray-600 bg-[#FFF5E1] px-3 py-1 rounded-full">
                Every Monday and Thursday
              </span>
            </div>
          ) : (
            <span className="text-lg text-gray-500 font-semibold"></span>
          )}

          <div className="relative mb-4">
            <Image
              src="/journal-book/logo.svg"
              alt="Piano Room"
              width={487}
              height={48}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg" />
          </div>

          <h3 className="text-xl font-semibold mt-2 text-gray-800">
            {sessionDetails.title}
          </h3>
          <p className="text-base text-gray-500 mt-2">
            {sessionDetails.description}
          </p>

          <button
            onClick={handleJoinSession}
            className="mt-6 w-1/4 bg-purple-700 text-white text-lg font-semibold py-2 px-4 rounded-full hover:bg-purple-800 transition duration-300 ease-in-out"
            disabled={isSessionJoined}
          >
            {isSessionJoined ? "Joined" : "Join session"}
          </button>
        </Card>
      )}
    </div>
  );
}