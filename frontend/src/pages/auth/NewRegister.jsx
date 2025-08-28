import React from "react";
import video from "../../video/5949377-hd_1920_1080_24fps.mp4";

const NewRegister = () => {
  return (
    <div>
      <div className="h-screen grid grid-cols-2 px-16 py-6 pt-18">
        <div className="bg-white dark:bg-slate-900 rounded-xl mt-6 shadow-md z-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <video
              className="w-full h-full object-cover rounded-xl"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag
            </video>
            {/* <div className="absolute inset-0 bg-black/60" /> */}
          </div>
        </div>
        <div className="flex items-center justify-center bg-white dark:bg-slate-900 px-20 py-15 rounded-xl mt-6 shadow-md z-20">
          {/* <h2 className="text-lg font-semibold">Login</h2> */}
          {/* <LoginForm  /> */}
        </div>
      </div>
    </div>
  );
};

export default NewRegister;
