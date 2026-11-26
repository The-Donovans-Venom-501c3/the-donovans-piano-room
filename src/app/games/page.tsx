"use client";
import { getUser } from "@/lib/api/userService";
import { refreshToken } from "@/lib/api/authService";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import GameApp from "./App";
import MembershipRequiredBanner from "@/components/membership/MembershipRequiredBanner";

const Games = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    handleGameRoute();
  }, []);

  if (loading) {
    return (
      <>
        <div className="w-[80%] mt-[9vh] mx-auto flex flex-col items-center justify-center flex-grow">
          <CircularProgress size={60} />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </>
    );
  }

  if (isAuthenticated) {
    return (
      <GameApp />
    );
  }

  return (
    <>
      {!isAuthenticated &&
        <div className="w-[80%] mt-[9vh] mx-auto flex-grow">
          <h1 className="text-5xl font-bold text-gray-800 mb-8">Games</h1>
          <MembershipRequiredBanner
            membershipHref="/about/membership"
            membershipLinkText="View Membership Levels"
            showLoginLink
          />
        </div>
      }
    </>
  )
}

export default Games;