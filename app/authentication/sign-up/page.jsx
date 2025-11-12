"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

library.add(faCircleExclamation);

// ✅ Zod Schema
const SignUpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Component() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // ✅ Hook form setup (no TypeScript types here)
  const form = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ✅ Submit handler
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Something went wrong");
      }

     toast.success("Account created successfully ✅");

      router.push("/");
    } catch (error) {
      toast.error(error.message || "Something went wrong ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-[90vh]">
      <div className="login-container relative w-[22.2rem]">
        {/* Top circle */}
        <div
          className="absolute w-32 h-32 bg-[#0F3460] rounded-full top-0 left-0 animate-animate-1"
        ></div>

        {/* Form */}
        <div className="form-container">
          <h1 className="text-4xl opacity-60 text-slate-200 uppercase text-center">
            Register
          </h1>

          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
            {/* Email */}
            <input
              type="email"
              placeholder="EMAIL"
              {...form.register("email")}
              className="block w-full p-4 mt-8 bg-opacity-10 bg-gray-500 text-[#ffffff] rounded-md outline-none focus:ring-2 focus:ring-gray-500"
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.email.message}
              </p>
            )}

            {/* Password */}
            <input
              type="password"
              placeholder="PASSWORD"
              {...form.register("password")}
              className="block w-full p-4 mt-8 bg-opacity-10 bg-gray-500 text-[#ffffff] rounded-md outline-none focus:ring-2 focus:ring-gray-500"
            />
            {form.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.password.message}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center gap-2 mt-8 p-4 ${
                isSubmitting ? "opacity-60 pointer-events-none" : ""
              } bg-[#0f3460] text-[#ffffff] rounded-md uppercase text-lg font-bold tracking-wide hover:shadow-md hover:scale-105 duration-300 transition-all`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Please wait...
                </>
              ) : (
                "Signup"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="flex justify-between mt-8 opacity-60 text-slate-200">
            <Link href="/sign-in" className="hover:text-white hover:scale-105">
              LOGIN
            </Link>
          </div>
        </div>

        {/* Bottom circle */}
        <div
          className="absolute w-32 h-32 bg-[#0f3460] rounded-full bottom-0 right-0 z-[-1] animate-animate-2"
        ></div>
      </div>
    </section>
  );
}
