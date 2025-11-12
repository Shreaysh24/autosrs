"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  faInfoCircle,
  faChartLine,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(faInfoCircle, faChartLine, faEdit);

function How() {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const progressBarRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const progressBar = progressBarRef.current;

    const togglePlay = () => {
      if (video) {
        if (video.paused) {
          video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      }
    };

    const updateButton = () => {
      const toggle = document.querySelector(".toggle");
      if (toggle) {
        toggle.textContent = video?.paused ? "►" : "❚ ❚";
      }
    };

    const handleProgress = () => {
      if (video && progressBar) {
        const percent = (video.currentTime / video.duration) * 100;
        progressBar.style.flexBasis = `${percent}%`;
      }
    };

    if (video) {
      video.addEventListener("click", togglePlay);
      video.addEventListener("play", updateButton);
      video.addEventListener("pause", updateButton);
      video.addEventListener("timeupdate", handleProgress);
    }

    return () => {
      if (video) {
        video.removeEventListener("click", togglePlay);
        video.removeEventListener("play", updateButton);
        video.removeEventListener("pause", updateButton);
        video.removeEventListener("timeupdate", handleProgress);
      }
    };
  }, []);

  return (
    <div id="how" className="flex gap-20 justify-center items-center">
      <div className="my-24 space-y-8 flex flex-col justify-center items-center px-5 md:px-32">
        <p
          style={{ fontFamily: " 'Cinzel Variable', serif" }}
          className="text-3xl md:text-5xl text-center tracking-wider font-medium text-white font-gradient"
        >
          How it works
        </p>

        {/* Steps */}
        <div className="flex flex-col justify-start items-start gap-12 w-96 translate-x-2">
          <div className="flex flex-col justify-start items-start gap-5">
            <div className="flex gap-3">
              <FontAwesomeIcon icon={faInfoCircle} size="xl" />
              <strong>Describe your project</strong>
            </div>
            <small>
              Share the details about what you want your software to do. No
              worries. We haven't collected any info about your idea.
            </small>
          </div>

          <div className="flex flex-col justify-start items-start gap-5">
            <div className="flex gap-3">
              <FontAwesomeIcon icon={faChartLine} size="xl" />
              <strong>Get results</strong>
            </div>
            <small>
              Our AI tool uses your input to create a comprehensive Software
              Requirements Specification with features, recommended tools, and
              a rough estimate of cost.
            </small>
          </div>

          <div className="flex flex-col justify-start items-start gap-5">
            <div className="flex gap-3">
              <FontAwesomeIcon icon={faEdit} size="xl" />
              <strong>Edit SRS</strong>
            </div>
            <small>
              You get a draft of the SRS that you can review, edit, and tailor
              to your needs.
            </small>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="hidden md:block p-4 bg-[#00000046] backdrop-blur-lg w-[480px] h-[564px]">
        <div className="player relative overflow-hidden w-full h-full flex">
          <video
            ref={videoRef}
            className="player__video viewer w-full h-full cursor-pointer"
            preload="auto"
            controlsList="nodownload"
            poster="https://cdn.prod.website-files.com/62e78607dd3aaccdd73125cb/650d50d3bfac667373ca6d41_srs-video-poster.webp"
          >
            <source src="/ai_srs_v2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="player__controls">
            <div ref={progressRef} className="progress">
              <div ref={progressBarRef} className="progress__filled"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default How;
