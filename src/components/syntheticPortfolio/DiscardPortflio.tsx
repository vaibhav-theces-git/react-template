import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { MuiBox } from "src/common/components/box/MuiBox";
import { MuiButton } from "src/common/components/button/MuiButtons/MuiButton";
import { CustomModal } from "src/common/components/modal/MuiModal/CustomModal";
import { errorPrefix } from "src/common/constants/testids";
import { getErrorMessageFromError } from "src/common/utilities/globalUtils";
import { useLazyDiscardPortfolioQuery } from "src/queries/portfolioSetupApi";
import { ErrorType } from "src/types/apiErrorTypes";
import {
  discardPortfolioRequestType,
  gridResponseType,
} from "src/types/syntheticPortfolioTypes";
import SnackBarUtils, {
  snackbarOption,
} from "src/common/components/SnackBarUtilsConfigurator";

interface DiscardPortflioProps {
  isDiscardModalOpen: boolean;
  onModalClose: () => void;
  discardPortfolioCallback: () => void;
  selectedGridPortfolio: gridResponseType[] | undefined;
  deletePortfolio: () => void;
}

const DiscardPortflio = (discardPortflioProps: DiscardPortflioProps) => {
  const {
    isDiscardModalOpen,
    onModalClose,
    discardPortfolioCallback,
    selectedGridPortfolio,
    deletePortfolio,
  } = discardPortflioProps;

  const [discardPortfolioDataTrigger] = useLazyDiscardPortfolioQuery();

  const discardWorkingPortfolio = () => {
    const sessionPortfolioId = Number(sessionStorage.getItem("portfolioId"));
    const sessionGroupId = Number(sessionStorage.getItem("groupId"));

    const discardPortfolioParams: discardPortfolioRequestType = {
      portfolio_id: sessionPortfolioId,
      group_id: sessionGroupId,
    };
    discardPortfolioDataTrigger(discardPortfolioParams)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: any | undefined;
          error: string;
        } = {
          status: resp.status,
          data: resp.data,
          error: getErrorMessageFromError(resp.error as ErrorType),
        };
        return respData;
      })
      .then((d) => {
        if (d.status === "fulfilled") {
          // eslint-disable-next-line
          if (d.data.length === 0) {
            discardPortfolioCallback();
            SnackBarUtils.success(
              "Portfolio discarded sucessfully",
              snackbarOption
            );
          }
        } else {
          const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
          SnackBarUtils.error(errorMsg, snackbarOption);
        }
      })
      .catch((e) => {
        const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
        SnackBarUtils.error(errorMsg, snackbarOption);
      });
  };

  const discardPortfolio = () => {
    discardWorkingPortfolio();
    sessionStorage.removeItem("portfolioId");
    sessionStorage.removeItem("groupId");
    onModalClose();
  };

  const isPositionSelected = selectedGridPortfolio !== undefined;

  return (
    <CustomModal
      key={"porfolioDiscardpModal"}
      isOpen={isDiscardModalOpen}
      handleClose={onModalClose}
      headerClassName="tw-text-xl tw-font-bold "
    >
      <MuiBox>
        {isPositionSelected
          ? `Are you sure to delete the positions?`
          : `Do you want to discard a working portfolio?`}
      </MuiBox>
      <MuiBox className="tw-flex tw-justify-end tw-mt-1">
        <MuiButton
          className="tw-m-1 tw-bg-slate-75 tw-text-sm"
          onClick={isPositionSelected ? deletePortfolio : discardPortfolio}
        >
          {isPositionSelected ? `Delete` : `Discard`}
        </MuiButton>
        <MuiButton
          className="tw-m-1 tw-bg-slate-75 tw-text-sm"
          onClick={onModalClose}
        >
          Cancel
        </MuiButton>
      </MuiBox>
    </CustomModal>
  );
};

export default DiscardPortflio;
