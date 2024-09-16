// import { helix } from "ldrs";

import React from "react";

const Loader = () => {
  // helix.register();
  return (
    <div className="h-full w-full flex items-center justify-center text-4xl">
      <l-helix size="100" speed="2.5" color="#8b5cf6"></l-helix>
    </div>
  );
};

export default Loader;
