import { MuiBox } from "src/common/components/box/MuiBox";
import { MuiButton } from "src/common/components/button/MuiButtons/MuiButton";
import { CustomModal } from "src/common/components/modal/MuiModal/CustomModal";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";

const OverrideModal = (props: {
  isOpen: boolean;
  overwritePortfolioCallback: () => void;
  createNewCallback: () => void;
  onClose: () => void;
}) => {
  const { isOpen, overwritePortfolioCallback, createNewCallback, onClose } =
    props;

  const overwritePortfolio = () => {
    overwritePortfolioCallback();
    onClose();
  };

  return (
    <div>
      <CustomModal isOpen={isOpen} handleClose={onClose}>
        <MuiBox>
          <MuiTypography className="tw-text-md ">
            Do you want to overwrite existing portfolio or create a new
            portfolio ?
          </MuiTypography>
        </MuiBox>
        <MuiBox className="tw-flex tw-justify-end tw-mt-1">
          <MuiButton
            className="tw-m-1 tw-bg-slate-75 tw-text-sm"
            onClick={overwritePortfolio}
          >
            Over Write
          </MuiButton>
          <MuiButton
            className="tw-m-1 tw-bg-slate-75 tw-text-sm"
            onClick={createNewCallback}
          >
            Create New
          </MuiButton>
          <MuiButton
            className="tw-m-1 tw-bg-slate-75 tw-text-sm"
            onClick={onClose}
          >
            Cancel
          </MuiButton>
        </MuiBox>
      </CustomModal>
    </div>
  );
};

export default OverrideModal;
