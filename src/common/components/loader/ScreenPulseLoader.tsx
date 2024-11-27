import { PulseLoader } from "react-spinners";
import { MuiBox } from "../box/MuiBox";
import { PulseLoaderProps } from "./types";

interface ScreenPulseLoaderProps {
  pulseLoaderProps?: PulseLoaderProps;
}

export const ScreenPulseLoader = (props: ScreenPulseLoaderProps) => {
  const { pulseLoaderProps } = props;
  return (
    <MuiBox className="tw-fixed tw-top-0 tw-left-0 tw-w-full tw-h-full tw-bg-slate-100 tw-opacity-50 tw-z-[99999] tw-flex tw-justify-center tw-items-center">
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <PulseLoader color="white" {...pulseLoaderProps} />
    </MuiBox>
  );
};
