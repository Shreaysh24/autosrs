"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import { faTwitter, faGithub, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
library.add(faXTwitter, faGithub, faTwitter);

// ✅ Zod Schema
const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Component() {
  const { data: session } = useSession();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // ✅ React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    setIsSubmitting(false);

    if (result?.error) {
      toast.error(result.error || "Invalid credentials ❌");
    } else if (result?.url) {
      router.replace("/");
    }
  };

  return (
    <section className="flex justify-center items-center min-h-[90vh] overflow-hidden">
      <div className="login-container relative w-[22.2rem]">
        <div
          className="absolute w-32 h-32 bg-[#0F3460] rounded-full top-0 left-0  animate-animate-1"
          style={{ "--i": 0 }}
        ></div>

        <div className="form-container">
          <h1 className="text-4xl opacity-60 text-slate-200 uppercase text-center">
            Login
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
            {/* Email */}
            <input
              type="text"
              placeholder="Email"
              {...register("email")}
              className="block w-full p-4 mt-8 bg-opacity-10 bg-gray-500 text-[#ffffff] rounded-md outline-none focus:ring-2 focus:ring-gray-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="block w-full p-4 mt-8 bg-opacity-10 bg-gray-500 text-[#ffffff] rounded-md outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}

            {/* Submit */}
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
                "Sign in"
              )}
            </button>
          </form>

          <div className="flex justify-between mt-8 opacity-60 text-slate-200">
            <Link href="/sign-up" className="hover:text-white hover:scale-105 uppercase">
              Register
            </Link>
            <Link
              href="/forgot-password"
              className="hover:text-white hover:scale-105 uppercase"
            >
              FORGOT PASSWORD
            </Link>
          </div>
        </div>

        <div
          className="absolute w-32 h-32 bg-[#0f3460] rounded-full bottom-0 right-0 z-[-1] animate-animate-2"
          style={{ "--i": 1 }}
        ></div>
      </div>
    </section>
  );
}
