"use client";
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; // ✅ import Sonner toast

function Contact() {
  const [nameCheck, setNameCheck] = useState("");
  const [emailCheck, setEmailCheck] = useState("");
  const [subjectCheck, setSubjectCheck] = useState("");
  const [messageCheck, setMessageCheck] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (nameCheck === "") {
      toast.error("Include your name!");
    } else if (emailCheck === "") {
      toast.error("Include your email!");
    } else if (subjectCheck === "") {
      toast.error("Include a subject!");
    } else if (messageCheck === "") {
      toast.error("Include a message!");
    } else {
      setIsSubmitting(true);
      emailjs
        .sendForm(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          formRef.current,
          process.env.NEXT_PUBLIC_EMAILJS_USER_ID
        )
        .then(
          (result) => {
            setIsSubmitting(false);
            console.log(result.text);
            toast.success("Message Sent!");
          },
          (error) => {
            console.log(error.text);
            toast.error(`An error occurred :( \n ${error.text}`);
          }
        );
    }
  };

  return (
    <div
      id="contact"
      className="my-32 space-y-8 flex flex-col justify-center items-center px-5 md:px-32"
    >
      <p
        style={{ fontFamily: " 'Cinzel Variable', serif" }}
        className="text-4xl md:text-6xl text-center tracking-wider font-medium text-white font-gradient"
      >
        Let's get in touch!
      </p>
      <p className="text-sm md:text-xl manrope text-center text-gray-300">
        We are open to any suggestions and would greatly appreciate your input
        or feedback
      </p>

      <form
        className="floating-label black-container flex flex-col items-center justify-around w-full md:w-80 my-2 text-lg"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <input
          className="bg-transparent py-5 px-3 w-96 md:w-[35rem] custom-border2 outline-none"
          type="text"
          placeholder="Enter your full name"
          name="user_name"
          required
          onChange={(e) => setNameCheck(e.target.value)}
        />
        <input
          className="bg-transparent py-5 px-3 w-96 md:w-[35rem] custom-border2 outline-none"
          type="email"
          placeholder="Enter your email address"
          name="user_email"
          required
          onChange={(e) => setEmailCheck(e.target.value)}
        />
        <input
          className="bg-transparent py-5 px-3 w-96 md:w-[35rem] custom-border2 outline-none"
          type="text"
          placeholder="Enter the subject of your message"
          name="user_subject"
          required
          onChange={(e) => setSubjectCheck(e.target.value)}
        />
        <textarea
          className="bg-transparent py-5 px-3 w-96 md:w-[35rem] custom-border2 outline-none"
          rows={4}
          required
          name="message"
          placeholder="Enter your message here..."
          onChange={(e) => setMessageCheck(e.target.value)}
        ></textarea>

        <div className="mt-10 button">
          <div className="button-layer"></div>
          <button
            type="submit"
            style={{ fontFamily: " 'Cinzel Variable', serif" }}
            className="bg-black px-4 py-3 w-full text-2xl font-semibold tracking-wide flex justify-center items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-7 w-7 animate-spin" /> Sending...
              </>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Contact;
