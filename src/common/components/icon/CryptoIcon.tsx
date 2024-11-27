import React, { useState, ImgHTMLAttributes, useRef, useEffect } from "react";
import Icon from "@mui/material/Icon";
import { useIsInViewport } from "src/common/hooks/useIsInViewport";

const ERRORED_FILES = new Map<string, string>();

interface ImageWithFallbackProps extends Omit<ImgHTMLAttributes<any>, "src"> {
  src: string; // Redefining src to make sure that src is never undefined
  fallback: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  fallback,
  src,
  alt,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  useEffect(() => {
    setImgSrc(src);
  }, [src]);
  const onError = () => {
    ERRORED_FILES.set(imgSrc, fallback);
    setImgSrc(fallback);
  };
  return (
    <img
      alt={alt}
      src={ERRORED_FILES.get(imgSrc) || imgSrc}
      onError={onError}
      {...props}
    />
  );
};

interface CyrptoIconProps {
  token: string;
  height?: ImageWithFallbackProps["height"];
}

// Ideally size should be controlled at the icon level.
// But the svgs we use dont follow the same convention and so we are
// setting it at the img level.
const CryptoIcon: React.FC<CyrptoIconProps> = ({ token, height = "20px" }) => {
  const ref = useRef<HTMLElement | null>(null);

  // load image only when user scrolled to the view
  const { viewed } = useIsInViewport(ref, true);

  return (
    <Icon sx={{ display: "flex", height, width: height }} ref={ref}>
      {viewed && (
        <ImageWithFallback
          alt={token}
          src={`/static/crypto-icons/${token.toLowerCase()}.svg`}
          fallback="/static/crypto-icons/generic.svg"
          height={height}
        />
      )}
    </Icon>
  );
};

export default React.memo(CryptoIcon);
