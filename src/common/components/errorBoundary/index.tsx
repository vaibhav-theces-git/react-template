import React from "react";
import * as Sentry from "@sentry/react";

interface SentryErrorBoundaryProps extends Sentry.ErrorBoundaryProps {
  fallbackData?: React.ReactElement | string;
}

const fallbackComponent = (
  message: string | React.ReactElement | undefined
) => {
  let fallback = message;
  if (!fallback) {
    fallback = "Failed to load";
  }
  if (typeof fallback === "string") {
    return (
      <p className="tw-flex tw-justify-center tw-text-center tw-items-center tw-text-lg tw-h-[90%]">
        {fallback}
      </p>
    );
  }
  return fallback;
};

export const SentryErrorBoundary = (props: SentryErrorBoundaryProps) => {
  const { fallbackData } = props;
  return (
    <Sentry.ErrorBoundary
      fallback={fallbackComponent(fallbackData)}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
};
