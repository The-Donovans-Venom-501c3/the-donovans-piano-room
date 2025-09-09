// components/FullScreenMessage.tsx
import React from "react";

export default function FullScreenMessage({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="max-w-7xl rounded-md bg-white p-8 text-center shadow-md">
        <p className="mb-4 text-8xl font-bold">{title}</p>
        <p className="text-6xl text-gray-700">{message}</p>
      </div>
    </div>
  );
}
