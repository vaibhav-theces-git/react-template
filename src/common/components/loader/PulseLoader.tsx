import { forwardRef } from "react";
// eslint-disable-next-line import/no-named-default
import { default as ReactSpinnersPulseLoader } from "react-spinners/PulseLoader";
import { PulseLoaderProps } from "./types";

export const DEFAULT_PULSE_LOADER_COLOR = "#ffffff40";

const PulseLoader: React.FC<PulseLoaderProps> = forwardRef<
  HTMLElement,
  PulseLoaderProps
>((props: PulseLoaderProps) => <ReactSpinnersPulseLoader {...props} />);

export default PulseLoader;
