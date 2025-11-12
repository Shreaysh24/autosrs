"use client";
export const dynamic = "force-dynamic";
import Hero from "./home-components/Hero.jsx";
import What from "./home-components/What.jsx";
import How from "./home-components/How.jsx";
import FAQ from "./home-components/FAQ.jsx";
import Contact from "./home-components/Contact.jsx";
import Footer from "./global-components/Footer.jsx";
import Generate from "./home-components/Generate.jsx";
import Link from "next/link";
import Image from "next/image";
import lockImage from "./assets/locker.png";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <>
      <section className="">
        <div className="color"></div>
        <div className="color"></div>
        <Hero />
        <What />
        <How />
        <div className=" mx-auto my-40 h-[50rem] relative z-20 bg-[#0000006f] glass w-[90%] py-12 px-10  gap-6 overflow-hidden shadow-md rounded-3xl flex flex-col justify-center items-center">
          {!session || !session.user.email ? (<>
            <Image
              src={lockImage}
              height={300}
              alt="Lock"
              className="absolute z-30 shadtow"
            />
            <div className="absolute z-10 opacity-20 pointer-events-none">
              <Generate />
            </div>
            <div className={`button2 absolute z-30 -bottom-40 shadow-2xl `}>
              <div className="button-layer2"></div>
              <Link href="#">
                <button className="bg-black px-4 py-2  w-full text-xl  font-bold tracking-wide text-black uppercase poppins-regular">
                  Login
                </button>
              </Link>
            </div>
          </>
          ) :
            <div className="absolute z-1">
              <Generate />
            </div>
          }
        </div>
        <FAQ />
        <Contact />
        <Footer />
      </section>
    </>
  );
}
