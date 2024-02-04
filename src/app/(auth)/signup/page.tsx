"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from 'next/link'

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SignupFormSchema } from "@/lib/schema";

import { addNewUser } from "@/app/actions";
import { Input, InputData } from "@/components/auth/form-input";
import { FormResult, FormResultProps } from "@/components/auth/form-result";

type Inputs = z.infer<typeof SignupFormSchema>;

export default function SignUp() {
  const [data, setData] = useState<Inputs>();
  const [formResult, setFormResult] = useState<FormResultProps>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(SignupFormSchema),
  });

  const processForm: SubmitHandler<Inputs> = async (data) => {
    const result = await addNewUser(data);

    if (!result) {
      console.log("Something went wrong");
      return;
    }

    if (result.error) {
      setFormResult({result: "fail", message: String(result.error)});      
      return;
    }

    setFormResult({result: "success"});      

    reset();
    setData(result.data);
  };

  return (
    <section className="mx-auto flex w-96 flex-col items-center justify-center px-4 py-8 md:h-screen ">
      <section className="space-y-4 p-6 sm:p-8 md:space-y-6">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900">
          Sign Up
        </h1>
        <form
          className="w-80 space-y-4 md:space-y-6"
          onSubmit={handleSubmit(processForm)}
        >
          {inputData.map((field) => (
            <Input
              key={field.id}
              field={field}
              register={register}
              errors={errors}
            />
          ))}
          <FormResult message="Something went wrong!"/>
          <button
            className="text-cente w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
            type="submit"
          >
            Create an account
          </button>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
            >
              Login here
            </Link>
          </p>
        </form>
      </section>
      <div className="flex rounded-lg bg-cyan-600 p-8 text-white">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </section>
  );
}

const inputData: InputData[] = [
  {
    id: "firstName",
    name: "firstName",
    label: "First Name:",
    type: "text",
    placeholder: "Type your first name",
  },
  {
    id: "lastName",
    name: "lastName",
    label: "Last Name:",
    type: "text",
    placeholder: "Type your last name",
  },
  {
    id: "email",
    name: "email",
    label: "E-mail address:",
    type: "email",
    placeholder: "Type your e-mail",
  },
  {
    id: "password",
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Create your password",
  },
  {
    id: "confirmPassword",
    name: "confirmPassword",
    label: "Confirm your password",
    type: "password",
    placeholder: "Confirm your password",
  },
];
