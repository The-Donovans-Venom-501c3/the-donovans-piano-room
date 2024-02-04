"use server";

import { z } from "zod";
import { SignupFormSchema } from "@/lib/schema";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getUserByEmail } from "@/db/functions";

type Inputs = z.infer<typeof SignupFormSchema>;

export async function addNewUser(data: Inputs) {
  const result = SignupFormSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: result.error.format() };
  }

  const { firstName, lastName, email, password } = result.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser.length > 0) {
    return { success: false, error: "Email already in use!" };
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: "",
    firstName,
    lastName,
    email,
    password: hashPassword,
  };

  await db.insert(users).values(newUser);

  return { success: true, data: result.data };
}
