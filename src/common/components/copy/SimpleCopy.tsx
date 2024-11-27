import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSnackbar } from "notistack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import { useState } from "react";
import { If } from "../conditional";
import { MuiBox } from "../box/MuiBox";

interface SimpleCopyProps extends CopyToClipboard.Props {
  onCopyAlertText?: string;
  copyIconClasses?: string;
  copiedIconClasses?: string;
  containerClasses?: string;
  childrenWrapperClasses?: string;
  showCopyIcon?: boolean;
}

export const SimpleCopy = (props: SimpleCopyProps) => {
  const {
    text,
    children,
    onCopyAlertText,
    containerClasses,
    copyIconClasses,
    copiedIconClasses,
    childrenWrapperClasses,
    showCopyIcon = true,
  } = props;
  const [isCopyVisible, setIsCopyVisible] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const autoHideDuration = 2000;

  const handleOnCopy = () => {
    enqueueSnackbar(onCopyAlertText || "Copied", {
      variant: "success",
      autoHideDuration,
    });

    setIsCopyVisible(false);
    setTimeout(() => {
      setIsCopyVisible(true);
    }, autoHideDuration);
  };
  return (
    <CopyToClipboard text={text} onCopy={handleOnCopy}>
      <MuiBox className={`tw-flex tw-cursor-pointer ${containerClasses || ""}`}>
        <MuiBox className={childrenWrapperClasses}>{children}</MuiBox>
        <MuiBox className="tw-ml-1">
          <If condition={showCopyIcon}>
            {isCopyVisible ? (
              <ContentCopyIcon
                className={`tw-text-base ${copyIconClasses || ""}`}
              />
            ) : (
              <LibraryAddCheckIcon
                className={`tw-text-base ${copiedIconClasses || ""}`}
              />
            )}
          </If>
        </MuiBox>
      </MuiBox>
    </CopyToClipboard>
  );
};
