import React from "react";
import Lottie from "lottie-react";
import fxLoaderAnimation from "./fxLoader.json";

const lottieStyle = {
  height: "98%",
  width: "100%",
};
export const FxLoader = () => {
  return (
    <div className="tw-w-full tw-h-screen">
      <Lottie
        animationData={fxLoaderAnimation}
        style={lottieStyle}
        loop
        autoplay
      />
    </div>
  );
};
