import { Loader } from "lucide-react";
import React from "react";

const LoadState = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
      <Loader className="h-8 w-8 animate-spin text-blue-600" />
      <p className="text-sm text-slate-500 font-medium">
        Resolving project directory...
      </p>
    </div>
  );
};

export default LoadState;
