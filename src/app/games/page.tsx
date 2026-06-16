"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LockOutlined from "@mui/icons-material/LockOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";

const Games = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Redirect to backend route — it will handle auth:
    // - logged in  → redirects to the Netlify games site
    // - not logged in → returns 401, user stays on this page
    router.replace("/api/games");

    // If still on this page after a short delay, the user is not authenticated
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="w-[80%] mt-[9vh] mx-auto flex flex-col items-center justify-center flex-grow">
        <CircularProgress size={60} />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-[80%] mt-[9vh] mx-auto flex-grow">
      <h1 className="text-5xl font-bold text-gray-800 mb-8">Games</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <LockOutlined sx={{ color: "#4B5563" }} />
          <h2 className="text-2xl font-bold text-gray-800">Membership Required</h2>
        </div>

        <p className="text-center mb-6">You must be a member to access this content.</p>

        <div className="flex justify-center mb-6">
          <Link href="/about/membership">
            <button className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-md">
              View Membership Levels
            </button>
          </Link>
        </div>

        <div className="text-center border-t border-gray-200 pt-6">
          <span className="text-gray-700">Already a member? </span>
          <Link href="/login" className="text-orange-500 hover:text-[#Da6a1c] underline font-medium">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Games;
