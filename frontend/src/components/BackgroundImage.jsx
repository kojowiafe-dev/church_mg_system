import React, { useState, useEffect } from 'react';

const BackgroundImage = ({ src, className = '', style = {}, fallbackColor = '#222', ...props }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    const img = new window.Image();
    img.src = src;
    img.onload = () => setLoaded(true);
  }, [src]);

  return (
    <div
      className={className}
      style={{
        ...style,
        backgroundColor: fallbackColor,
        backgroundImage: loaded ? `url(${src})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: loaded ? 1 : 0.7,
        transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 10,
      }}
      {...props}
    />
  );
};

export default BackgroundImage; 