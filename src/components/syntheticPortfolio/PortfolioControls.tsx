import { Add, Delete, Edit } from "@mui/icons-material";
import SnackBarUtils, {
  snackbarOption,
} from "src/common/components/SnackBarUtilsConfigurator";
import SaveIcon from "@mui/icons-material/Save";
import CalculateIcon from "@mui/icons-material/Calculate";
import { MuiBox } from "src/common/components/box/MuiBox";
import { MuiButton } from "src/common/components/button/MuiButtons/MuiButton";
import MuiTooltip from "src/common/components/tooltip/MuiTooltip";
import {
  calculatePortfolioRequestType,
  calculatePortfolioResponseType,
  gridResponseType,
  newPortfolioNameResponseType,
  portfolioSaveRequestType,
  portfolioSaveResponsetype,
  portfolioStatusRequestType,
  portfolioStatusResponseType,
  portfoliStatusRequestType,
  portfoliStatusResponseType,
} from "src/types/syntheticPortfolioTypes";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import {
  useLazyCalculatePortfolioQuery,
  useLazyGetPortfolioSavedStatusQuery,
  useLazyGetPortfolioStatusQuery,
  useLazySavePortfolioQuery,
} from "src/queries/portfolioSetupApi";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { getErrorMessageFromError } from "src/common/utilities/globalUtils";
import { ErrorType } from "src/types/apiErrorTypes";
import { errorPrefix } from "src/common/constants/testids";
import { useEffect, useMemo, useState } from "react";
import { PORTFOLIO_STATUS } from "src/common/constants/sytheticPortfolioConstants";
import OverrideModal from "./OverrideModal";
import PortfolioName from "./PortfolioName";

interface PortfolioControlsProps {
  portfolioId: number;
  optionValue: number | null;
  portfolioName: newPortfolioNameResponseType | undefined;
  gridPositionsData: gridResponseType[] | undefined;
  groupId: number;
  existingPortfolio: string;
  selectedPortfolio: gridResponseType[] | undefined;
  isPortfoliosSelected: gridResponseType[] | undefined;
  addNewPortfolioCallback: () => void;
  onEditPortfolioCallback: () => void;
  deletePositionsCallback: () => void;
  selectAccountsCallback: () => void;
  ondeleteAccountsCallback: () => void;
  addPosition: () => void;
  onPortfolioSave: (portfolio: portfolioSaveResponsetype) => void;
  portfolioStatus: (status: portfoliStatusResponseType | undefined) => void;
  jobStatus: portfoliStatusResponseType | undefined;
}

const PortfolioControls = (portfolioControlsProps: PortfolioControlsProps) => {
  const {
    portfolioId,
    optionValue,
    portfolioName,
    groupId,
    gridPositionsData,
    existingPortfolio,
    addNewPortfolioCallback,
    onEditPortfolioCallback,
    deletePositionsCallback,
    selectAccountsCallback,
    selectedPortfolio,
    addPosition,
    onPortfolioSave,
    portfolioStatus,
    jobStatus,
  } = portfolioControlsProps;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [portfolioNameModalOpen, setPortfolioModalOpen] =
    useState<boolean>(false);
  const [savePortfolio, setSavePortfolio] = useState<boolean>(false);
  const [portfolioSaveStatus, setPortfolioSaveDaStatus] =
    useState<boolean>(false);
  const [statusData, setStatusData] = useState<
    portfoliStatusResponseType | undefined
  >(jobStatus);
  const [disableButtons, setDisabledButtons] = useState(false);

  const [portfolioStatusDataTrigger] = useLazyGetPortfolioStatusQuery();
  const [savePortfolioDataTrigger] = useLazySavePortfolioQuery();
  const [calculatePortfolioDataTrigger] = useLazyCalculatePortfolioQuery();
  const [portfolioSavedStatusTrigger] = useLazyGetPortfolioSavedStatusQuery();

  const savePortfolioData = (params: portfolioSaveRequestType) => {
    savePortfolioDataTrigger(params)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: portfolioSaveResponsetype | undefined;
          error: string;
        } = {
          status: resp.status,
          data: resp.data,
          error: getErrorMessageFromError(resp.error as ErrorType),
        };
        return respData;
      })
      .then((d) => {
        if (d.status === "fulfilled" && d.data !== undefined) {
          onPortfolioSave(d.data);
          SnackBarUtils.success("Portfolio saved successfully", snackbarOption);
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

  const calculatePortfolioData = (params: calculatePortfolioRequestType) => {
    calculatePortfolioDataTrigger(params)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: calculatePortfolioResponseType | undefined;
          error: string;
        } = {
          status: resp.status,
          data: resp.data,
          error: getErrorMessageFromError(resp.error as ErrorType),
        };
        return respData;
      })
      .then((d) => {
        if (d.status === "fulfilled" && d.data !== undefined) {
          SnackBarUtils.success(`${d.data.message}`, snackbarOption); //eslint-disable-line
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

  const handleOtherCases = () => {
    let pName = "";
    const newPName =
      portfolioName?.portfolio_name !== undefined
        ? portfolioName?.portfolio_name
        : "";
    switch (optionValue) {
      case 1: {
        pName = existingPortfolio;
        setSavePortfolio(true);
        const portfolioSaveDataParams: portfolioSaveRequestType = {
          group_id: groupId,
          portfolio_id: portfolioId,
          portfolio_name: pName || newPName,
          over_write_flag: "N",
        };
        savePortfolioData(portfolioSaveDataParams);
        break;
      }
      case 2: {
        setIsModalOpen(true);
        break;
      }
      case 3: {
        setPortfolioModalOpen(true);
        break;
      }
      default: {
        pName = existingPortfolio;
        break;
      }
    }
    if (savePortfolio) {
      const portfolioSaveDataParams: portfolioSaveRequestType = {
        group_id: groupId,
        portfolio_id: portfolioId,
        portfolio_name: pName,
        over_write_flag: "N",
      };
      savePortfolioData(portfolioSaveDataParams);
    }
  };

  const onSavePortfolio = () => {
    setStatusData(undefined);
    portfolioStatus(undefined);

    const savedStatusParams: portfolioStatusRequestType = {
      portfolio_id: portfolioId,
    };
    portfolioSavedStatusTrigger(savedStatusParams)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: portfolioStatusResponseType | undefined;
          error: string;
        } = {
          status: resp.status,
          data: resp.data,
          error: getErrorMessageFromError(resp.error as ErrorType),
        };
        return respData;
      })
      .then((d) => {
        if (d.status === "fulfilled" && d.data !== undefined) {
          if (d.data.status) {
            setPortfolioSaveDaStatus(d.data.status);
            const portfolioSaveDataParams: portfolioSaveRequestType = {
              group_id: groupId,
              portfolio_id: portfolioId,
              portfolio_name: existingPortfolio,
              over_write_flag: "N",
            };
            savePortfolioData(portfolioSaveDataParams);
          } else {
            handleOtherCases();
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

  const calculatePortfolio = () => {
    const calculatePortfolioDataParams: calculatePortfolioRequestType = {
      group_id: groupId,
      portfolio_id: portfolioId,
    };
    calculatePortfolioData(calculatePortfolioDataParams);
    setStatusData(undefined);
    portfolioStatus(undefined);
    setDisabledButtons(true);
  };

  const onOverrideModalClose = () => {
    setIsModalOpen(false);
  };

  const onPortfolioModalClose = () => {
    setPortfolioModalOpen(false);
  };

  const createNew = () => {
    setIsModalOpen(false);
    setPortfolioModalOpen(true);
  };

  const overwritePortfolio = () => {
    setSavePortfolio(true);
    const portfolioSaveDataParams: portfolioSaveRequestType = {
      group_id: groupId,
      portfolio_id: portfolioId,
      portfolio_name: existingPortfolio,
      over_write_flag: "O",
    };
    savePortfolioData(portfolioSaveDataParams);
  };

  const portfolioSave = (portfolio: string) => {
    if (optionValue === 3 || optionValue === 1 || portfolioSaveStatus) {
      setSavePortfolio(true);
    }
    const portfolioSaveDataParams: portfolioSaveRequestType = {
      group_id: groupId,
      portfolio_id: portfolioId,
      portfolio_name: portfolio,
      over_write_flag: "N",
    };
    savePortfolioData(portfolioSaveDataParams);
  };

  const portfolio =
    portfolioName && portfolioName.portfolio_name
      ? portfolioName.portfolio_name
      : existingPortfolio
      ? `${existingPortfolio}`
      : null;

  const status = useMemo(() => {
    if (jobStatus !== undefined) {
      return jobStatus;
    }
    return undefined;
  }, [jobStatus]);

  useEffect(() => {
    setStatusData(status);
  }, [status]);

  // eslint-disable-next-line
  useEffect(() => {
    if (groupId > 0 && portfolioId > 0) {
      const PortfolioStatusParams: portfoliStatusRequestType = {
        portfolio_id: portfolioId,
      };
      const intervalId = setInterval(() => {
        portfolioStatusDataTrigger(PortfolioStatusParams)
          .then((resp) => {
            const respData: {
              status: QueryStatus;
              data: portfoliStatusResponseType | undefined;
              error: string;
            } = {
              status: resp.status,
              data: resp.data,
              error: getErrorMessageFromError(resp.error as ErrorType),
            };
            return respData;
          })
          .then((d) => {
            if (d.status === "fulfilled" && d.data !== undefined) {
              portfolioStatus(d.data);
              if (
                d.data.status === PORTFOLIO_STATUS.RESULT ||
                d.data.status === PORTFOLIO_STATUS.FAILED
              ) {
                setDisabledButtons(false);
                clearInterval(intervalId);
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
      }, 2000);
      return () => clearInterval(intervalId);
    }
  }, [groupId, portfolioId, jobStatus]); // eslint-disable-line

  return (
    <MuiBox className="tw-flex tw-items-center tw-justify-between">
      <MuiBox className="tw-mt-2 tw-m-3 tw-text-sm tw-flex tw-font-bold tw-text-orange-200">
        Portfolio name:
        <MuiTypography className="tw-ml-1 tw-text-sm tw-font-bold">
          {portfolio}
        </MuiTypography>
      </MuiBox>
      <MuiBox className="tw-flex tw-grow tw-justify-center tw-ml-56">
        <span className="tw-text-sm tw-font-extrabold tw-text-orange-200">
          Status : {statusData && statusData.status}
        </span>
      </MuiBox>
      <MuiBox className="tw-flex tw-m-0.5">
        {[
          {
            label: "Portfolio setup",
            onClick: addNewPortfolioCallback,
            disabled: disableButtons,
          },
          {
            label: "Select accounts",
            onClick: selectAccountsCallback,
            disabled: !portfolio || disableButtons,
          },
          {
            label: "Add positions",
            onClick: addPosition,
            icon: <Add />,
            disabled: !portfolio || disableButtons,
          },
          {
            label: "Edit positions",
            onClick: onEditPortfolioCallback,
            disabled: selectedPortfolio === undefined || disableButtons,
            icon: <Edit />,
          },
          {
            label: "Delete positions",
            onClick: deletePositionsCallback,
            disabled: selectedPortfolio === undefined || disableButtons,
            icon: <Delete />,
          },
          {
            label: "Calculate Portfolio",
            onClick: calculatePortfolio,
            icon: <CalculateIcon />,
            disabled: gridPositionsData?.length === 0 || disableButtons,
          },
          {
            label: "Save Portfolio",
            onClick: onSavePortfolio,
            disabled:
              portfolioId === 0 ||
              groupId === 0 ||
              gridPositionsData?.length === 0 ||
              disableButtons,
            icon: <SaveIcon />,
          },
        ].map(({ label, onClick, disabled, icon }) => (
          <MuiButton
            key={label}
            className="tw-bg-slate-500 tw-text-white tw-m-0.5 tw-text-xs tw-font-normal"
            sx={{
              width: icon ? "32px" : "120px",
              minWidth: "32px",
              height: "32px",
            }}
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
          >
            {icon ? <MuiTooltip title={label}>{icon}</MuiTooltip> : label}
          </MuiButton>
        ))}
      </MuiBox>
      <OverrideModal
        isOpen={isModalOpen}
        onClose={onOverrideModalClose}
        createNewCallback={createNew}
        overwritePortfolioCallback={overwritePortfolio}
      />
      <PortfolioName
        isOpen={portfolioNameModalOpen}
        onClose={onPortfolioModalClose}
        portfolioSaveCallback={portfolioSave}
        optionValue={optionValue}
      />
    </MuiBox>
  );
};

export default PortfolioControls;
