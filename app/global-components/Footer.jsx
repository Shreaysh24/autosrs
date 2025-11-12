import React from "react";
import {
  faMapLocationDot,
  faEnvelope,
  faPhone,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import {
  faTwitter,
  faGithub,
  faXTwitter,
  faLinkedin,
  faInstagram,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

// Add icons to library
library.add(
  
  faHeart
  
);

function Footer() {
  return (
    <footer className="w-full bg-[#00000069] py-12 md:py-16 md:h-[10rem] px-5 md:px-32 flex flex-col justify-end md:justify-between items-start gap-5 backdrop-blur-lg shadow-lg z-10">
      

      {/* Bottom Section */}
      <div className="flex w-full relative justify-center items-center pt-5 tracking-wide">
        <hr className="divider mt-2" />
        <p className="text-gray-200 manrope text-center md:text-start translate-y-5 px-5">
          &copy; 2025 AutoSrs.AI - All rights reserved. Designed With{" "}
          <FontAwesomeIcon className="hover:text-red-600" icon={faHeart} /> By Grp 49
        </p>
      </div>
    </footer>
  );
}

export default Footer;
