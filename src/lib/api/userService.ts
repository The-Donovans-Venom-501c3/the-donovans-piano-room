import { UserUpdateData } from "@/interfaces/profileInterface";
import exp from "constants";

export const getUser = async () => {
  try {
    const response = await fetch("/api/user/", {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);
    return { data, ok: response.ok };
  } catch (err) {
    return { ok: false };
  }
};

export const updateUser = async (userData: UserUpdateData) => {
  const response = await fetch("/api/user/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  return { data, ok: response.ok };
};
