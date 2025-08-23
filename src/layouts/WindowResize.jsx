import { useState, useEffect } from 'react';

const WindowResize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,  // <-- Set initial size to actual window size
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export default WindowResize;
