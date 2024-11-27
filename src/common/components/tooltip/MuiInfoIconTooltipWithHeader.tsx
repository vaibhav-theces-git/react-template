import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import { MuiBox } from "../box/MuiBox";

const HEADER = "What does this represent?";

export type InfoIconTooltipWithHeaderProps = {
  text: string;
  infoText: string;
  header?: string;
};

const MuiInfoIconTooltipWithHeader: React.FC<
  InfoIconTooltipWithHeaderProps
> = ({ text, infoText, header = HEADER }) => {
  return (
    <>
      <span>{text}</span>
      <MuiBox className="tw-ml-1 tw-mt-1">
        <Tooltip
          title={
            <>
              <div className="tw-px-4 tw-py-2 tw-bg-[#4F566B] tw-rounded-t-md">
                {header}
              </div>
              <div className="tw-px-4 tw-py-2 tw-bg-[#3C4257] tw-rounded-b-md">
                {infoText}
              </div>
            </>
          }
          arrow
          classes={{
            tooltip: "tw-px-0 tw-py-0 tw-rounded-md tw-text-lg",
          }}
          placement="bottom"
        >
          <InfoIcon fontSize="inherit" />
        </Tooltip>
      </MuiBox>
    </>
  );
};

export default MuiInfoIconTooltipWithHeader;
