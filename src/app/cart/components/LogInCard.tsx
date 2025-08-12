"use client";
import React, { useState } from "react";
import Button3 from "@/components/atoms/Button3";
import InputForm from "@/components/atoms/form-input";
import PaymentCard from "./PaymentCard";
import { login } from "@/lib/api/authService";
import { getUser } from "@/lib/api/userService";
import { useSetAtom } from "jotai";
import { profileAtom } from "@/utils/stores";
import { useRouter } from 'next/navigation';

export default function LogInCard() {
  const setProfile = useSetAtom(profileAtom);
  const router = useRouter();

  const [showSignIn, setShowSignIn] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(true);

  // Control button disabled state based on email and password input
  React.useEffect(() => {
    setDisabled(!(email && password));
  }, [email, password]);

  // Fetch user profile data after login
  const fetchUserData = async () => {
    try {
      const { data, ok } = await getUser();
      if (ok) {
        setProfile(data);
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Handle login action
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }
    try {
      const { data, ok } = await login(email, password);
      if (ok) {
        const success = await fetchUserData();
        if (success) {
          // Login successful, show payment page instead of redirecting
          setShowPayment(true);
        } else {
          alert("Unable to retrieve user information");
        }
      } else {
        alert(`Login failed: ${data.message}`);
      }
    } catch (error) {
      alert("An error occurred during login");
      console.error(error);
    }
  };

  // Show sign-in form when user clicks "Sign-Up" link
  const handleShowForm = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setShowSignIn(true);
  };

  // Handle guest checkout button click to directly go to checkout page
  const handleGuestCheckout = () => {
    setShowPayment(true);
  };

  // Show PaymentCard component after successful login
  if (showPayment) {
    return <PaymentCard />;
  }

  return (
    <div className="flex flex-col rounded-[12px] bg-white p-[32px] gap-[2vh] shadow-md tablet:w-full laptop:w-[45%] h-full mt-6">
      <p className="text-2xl">You are checking out as a Guest</p>

      <Button3
        text={
          <div className="flex text-xl items-center justify-center gap-3">
            <span>Continue as a Guest</span>
          </div>
        }
        onClick={handleGuestCheckout}  // Navigate directly to checkout
      />

      <p className="text-2xl">
        If you do not have an account, please{" "}
        <a
          href="#"
          className="text-purple-800 underline"
          onClick={handleShowForm}
        >
          Sign-Up
        </a>{" "}
        here
      </p>

      {showSignIn && (
        <>
          <InputForm
            field={{ label: "Email ID", name: "email", type: "email" }}
            error=""
            text={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
          <InputForm
            field={{ label: "Password", name: "password", type: "password" }}
            text={password}
            error=""
            onChange={(e: any) => setPassword(e.target.value)}
          />
        </>
      )}

      <Button3
        text={
          <div className="flex items-center justify-center gap-3">
            <span>Sign In</span>
          </div>
        }
        onClick={showSignIn ? handleLogin : handleShowForm}
      />
    </div>
  );
}
