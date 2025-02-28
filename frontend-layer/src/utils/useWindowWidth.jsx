import * as React from "react";

/**
 * React Hook that you can use anywhere to get the width of the window as a state
 * @returns updating width of the window
 */
export default function useWindowWidth() {
     const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
    
      // Update window width state variable when window is resized
      React.useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);
    
    return windowWidth;
}