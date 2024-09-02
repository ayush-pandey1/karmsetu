import React from "react";
import { dotStream } from "ldrs";

const Loader2 = () => {
  dotStream.register();
  return (
    <div className="h-full w-full flex items-center justify-center text-4xl">
      <l-dot-stream size="100" speed="2.5" color="#8b5cf6"></l-dot-stream>
    </div>
  );
};

export default Loader2;
