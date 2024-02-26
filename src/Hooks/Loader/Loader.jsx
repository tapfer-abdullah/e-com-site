import { useLottie } from "lottie-react";
import React from "react";
import dot from "../../../public/lottie/dot_loading.json";
import zero from "../../../public/lottie/zero_loading.json";
import "./Loader.css";

const Loader = ({ style }) => {
  const dotOptions = {
    animationData: dot,
    loop: true,
  };

  const zeroOptions = {
    animationData: zero,
    loop: true,
  };

  const { View: DotView } = useLottie(dotOptions);
  const { View: ZeroView } = useLottie(zeroOptions);
  const { View: ZeroView2 } = useLottie(zeroOptions);

  return (
    <div className={`flex justify-center ${style}`}>
      <div className="flex justify-center items-center text-xl space-x-1 font-semibold">
        <span className="loader-text">ODBH</span>
        <span className="zero-span">{ZeroView || "O"}</span>
        <span className="zero-span">{ZeroView2 || "O"}</span>
        <span className="loader-text">TSTORE</span>
      </div>
      <span className="dot-span">{DotView}</span>
    </div>
  );
};

export default Loader;
