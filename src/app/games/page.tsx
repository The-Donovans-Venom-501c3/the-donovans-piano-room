"use client";
import { getUser } from "@/lib/api/userService";
import { refreshToken } from "@/lib/api/authService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LockOutlined from "@mui/icons-material/LockOutlined";
import CircularProgress from "@mui/material/CircularProgress";

const Games = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleGameRoute = async () => {
    try {
      // First, try to get user with current access token
      let { data, ok } = await getUser();

      // If user is not authenticated, try refreshing the token
      if (!ok) {
        try {
          const refreshResult = await refreshToken();
          if (refreshResult.ok) {
            // After refreshing token, try to get user info again
            const retryResult = await getUser();
            ok = retryResult.ok;
            data = retryResult.data;
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
        }
      }

      // Final authentication check after potential token refresh
      if (ok) {
        setIsAuthenticated(true);
        router.replace("https://thedonovansmusicgames.netlify.app/");
        return;
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error in game route handler:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGameRoute();
  }, []);

  if (loading) {
    return (
      <>
        <div
          role="status"
          aria-live="polite"
          className="w-[80%] mt-[9vh] mx-auto flex flex-col items-center justify-center flex-grow"
        >
          <CircularProgress size={60} aria-hidden="true" />
          <p className="mt-4 text-gray-600">Loading games, please wait…</p>
        </div>
      </>
    );
  }

  return (
    <>
      {!isAuthenticated &&
        <div className="w-[80%] mt-[9vh] mx-auto flex-grow">
          <h1 className="text-5xl font-bold text-gray-800 mb-8">Games</h1>
          <p className="sr-only">
            The music games include a note identification quiz. If you use assistive technology and need help with the quiz,
            please contact us at info@theDonovan.org for support.
          </p>

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
      }
    </>
  )
}

export default Games;