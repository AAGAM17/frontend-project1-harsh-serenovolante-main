import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from 'next/image';

interface DraggableIframeProps {
  embedUrl: string;
  showOrgChart: boolean;
}

export default function DraggableIframe({ embedUrl, showOrgChart }: DraggableIframeProps) {
  const dragConstraints = { left: -500, right: 500, top: -500, bottom: 500 };
const [screenSize, setScreenSize] = useState({ width: window.innerWidth, height: window.innerHeight });
useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    console.log(screenSize);
    return () => window.removeEventListener("resize", handleResize);
  }, [screenSize]);
  return (
    showOrgChart && (
      <motion.div className="absolute top-full right-4 border-[#E5E5E5] border-[1.5px] color-white  rounded-[8px] p-4 mt-2 max-w-[500px] w-[90%] shadow-xl overflow-auto bg-white"
        drag
        dragConstraints={dragConstraints}
        style={{
          position: "absolute",
          top: 60,
          left: "15px",
          cursor: "grab",
          zIndex: 1000,
          height: `${screenSize.height * 0.5}px`
        }}
      >
        {/* <div className="border border-[#E5E5E5] border-[1.5px] bg-white hover:shadow-md rounded-[8px] p-4 max-w-[00px] w-[90%] h-[600px]"> */}
          <iframe
            src={embedUrl ?? ""}
            className="w-full h-full rounded-lg"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        {/* </div> */}
      </motion.div>
    )
  );
}
