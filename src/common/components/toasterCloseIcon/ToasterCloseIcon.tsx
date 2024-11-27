import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from "notistack";

const ToasterClose = () => {
  const { closeSnackbar } = useSnackbar();
  return (
    <CloseIcon onClick={() => closeSnackbar()} className="tw-cursor-pointer" />
  );
};

export default ToasterClose;
