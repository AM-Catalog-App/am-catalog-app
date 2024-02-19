import { useState, useEffect } from "react";
import theme from "../styles/amTheme";

interface IProp {
  breakpointValue?: "md" | "sm";
}

export default function useIsMobile({ breakpointValue }: IProp = {}) {
  // console.log("breakpointValue", breakpointValue);
  const defaultBreakpointValue = breakpointValue || "sm";
  const [isMobile, setIsMobile] = useState(() => {
    return (
      window.innerWidth <= theme.breakpoints.values[defaultBreakpointValue]
    );
  });

  useEffect(() => {
    function handleResize() {
      // console.log("defaultBreakpointValue", defaultBreakpointValue);
      setIsMobile(
        window.innerWidth <= theme.breakpoints.values[defaultBreakpointValue]
      );
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}
