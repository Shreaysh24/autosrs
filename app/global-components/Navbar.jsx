"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, usePathname } from "next/navigation";
import { useMenu } from "@/context/MenuContext";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  faRightToBracket,faCircleUser,faRightFromBracket,faDiagramProject
} from "@fortawesome/free-solid-svg-icons";

library.add(faRightToBracket,faCircleUser,faRightFromBracket,faDiagramProject);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();




  const { showMobileMenu, setShowMobileMenu } = useMenu();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleMediaQueryChange = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const navbarClass = scrolled ? "custom-border" : "";

  return (
    <div
      className={`sticky ${navbarClass} bg-[#00000055] top-0 z-50 w-full px-5 md:px-0 py-3 flex justify-between items-center gap-5 backdrop-blur-xl shadow-lg`}
    >
      {/* MOBILE HAMBURGER */}
      <div
        className={`${showMobileMenu ? "change" : ""} pl-2 block md:hidden cursor-pointer`}
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        <div className="bar1 h-1 w-9"></div>
        <div className="bar2 h-1 w-6"></div>
        <div className="bar3 h-1 w-4"></div>
      </div>

      <Link href="/">
        <h2
          style={{ fontFamily: "Robot" }}
          className="hidden md:block text-xl tracking-widest font-semibold cursor-pointer font-gradient md:ml-28"
        >
          AutoSrs.AI
        </h2>
      </Link>

      {/* DESKTOP NAV LINKS */}
      <ul
        className={`${pathname === "/" ? "md:flex" : "md:hidden"
          } hidden justify-center items-center gap-8 font-bold -translate-x-10`}
      >
        <li
          onClick={() => scrollToSection("what")}
          className="nav-item cursor-pointer text-sm text-[#ccc] hover:text-white"
        >
          What is SRS?
        </li>
        <li
          onClick={() => scrollToSection("how")}
          className="nav-item cursor-pointer text-sm text-[#ccc] hover:text-white"
        >
          How it works?
        </li>
        <li
          onClick={() => scrollToSection("FAQ")}
          className="nav-item cursor-pointer text-sm text-[#ccc] hover:text-white"
        >
          FAQ
        </li>
        <li
          onClick={() => scrollToSection("contact")}
          className="nav-item cursor-pointer text-sm text-[#ccc] hover:text-white"
        >
          Contact
        </li>
      </ul>

      {session && session.user.email ? (
        <div className="flex justify-center items-center gap-5 md:mr-28">
       
         <p className="text-gray-200 font-semibold py-2">Hello, { session.user.email.split('@')[0]}</p>
      
         <DropdownMenu>
              <DropdownMenuTrigger className="text-white font-bold cursor-pointer">
                 <FontAwesomeIcon icon={faCircleUser} className="hover:text-blue-900 text-gray-200 text-2xl cursor-pointer " />
      
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FontAwesomeIcon icon={faDiagramProject} className="hover:text-blue-900 text-gray-200 text-2xl cursor-pointer " /> <Link href="/projects" className="ml-2">Projects</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                 <FontAwesomeIcon icon={faRightFromBracket}  className="hover:text-blue-900 text-gray-200 text-2xl cursor-pointer " /> <span className="ml-2">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
         </div>
      ) :
        (< Link href="/authentication/sign-in">
          <button className="bg-slate-800 bg-opacity-80 hover:bg-slate-900 tracking-wide text-gray-200 font-semibold px-5 py-2 flex justify-center items-center gap-3 rounded-xl md:mr-28">
            <FontAwesomeIcon icon={faRightToBracket} />
            <p>Login</p>
          </button>
        </Link>)
      }


    </div >

  );
};

export default Navbar;
