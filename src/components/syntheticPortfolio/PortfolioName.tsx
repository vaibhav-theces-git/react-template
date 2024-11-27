import { ChangeEvent, useState } from "react";
import SnackBarUtils, {
  snackbarOption,
} from "src/common/components/SnackBarUtilsConfigurator";
import { MuiBox } from "src/common/components/box/MuiBox";
import { MuiButton } from "src/common/components/button/MuiButtons/MuiButton";
import { MuiTextField } from "src/common/components/input/MuiInputs";
import { CustomModal } from "src/common/components/modal/MuiModal/CustomModal";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";

const PortfolioName = (props: {
  isOpen: boolean;
  onClose: () => void;
  portfolioSaveCallback: (portfolio: string) => void;
  optionValue: number | null;
}) => {
  const { isOpen, onClose, portfolioSaveCallback, optionValue } = props;
  const [portfolioName, setPortfolioName] = useState("");

  const handlePortfolioNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPortfolioName(event.target.value);
  };

  const PortfolioNameSave = () => {
    if (portfolioName.length !== 0) {
      portfolioSaveCallback(portfolioName);
      onClose();
    } else {
      SnackBarUtils.warning(`Field cannot be empty`, snackbarOption);
    }
  };

  const cancelPortfolio = () => {
    setPortfolioName("");
    onClose();
  };

  return (
    <div>
      <CustomModal
        isOpen={isOpen}
        handleClose={onClose}
        title={
          optionValue !== null &&
          optionValue === 3 && (
            <MuiBox>
              <MuiTypography className="tw-text-sm tw-pr-4 ">
                [ Please provide portfolio name for selcted batch ]
              </MuiTypography>
            </MuiBox>
          )
        }
      >
        <MuiBox className="tw-flex tw-justify-center">
          <MuiTypography className="tw-text-sm tw-mt-1 tw-pr-1">
            Portfolio name :
          </MuiTypography>
          <MuiBox>
            <MuiTextField
              sx={{
                "& .MuiInputBase-root": {
                  height: "30px",
                },
                width: "200px",
              }}
              onChange={handlePortfolioNameChange}
            />
          </MuiBox>
        </MuiBox>
        <MuiBox className="tw-flex tw-justify-end tw-mt-1">
          <MuiButton
            className="tw-m-1 tw-bg-slate-75 tw-text-sm"
            onClick={PortfolioNameSave}
          >
            Save
          </MuiButton>
          <MuiButton
            className="tw-m-1 tw-bg-slate-75 tw-text-sm"
            onClick={cancelPortfolio}
          >
            Cancel
          </MuiButton>
        </MuiBox>
      </CustomModal>
    </div>
  );
};

export default PortfolioName;
