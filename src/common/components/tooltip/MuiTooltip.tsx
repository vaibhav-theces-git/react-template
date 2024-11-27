import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";

const MuiTooltip = styled(
  ({
    className,
    arrow = true,
    ...props
  }: {
    className?: string;
  } & TooltipProps) => (
    <Tooltip arrow={arrow} {...props} classes={{ popper: className }} />
  )
)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#000",
    color: "#fff",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
  },
  [`&.${tooltipClasses.popper}`]: {
    zIndex: 10000,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#000",
  },
}));

export default MuiTooltip;
