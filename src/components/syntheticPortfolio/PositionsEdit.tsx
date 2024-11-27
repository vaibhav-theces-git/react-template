import { SelectChangeEvent } from "@mui/material";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { GridApi } from "ag-grid-enterprise";
import dayjs, { Dayjs } from "dayjs";
import { ChangeEvent, useEffect, useState } from "react";
import SnackBarUtils, {
  snackbarOption,
} from "src/common/components/SnackBarUtilsConfigurator";
import { MuiBox } from "src/common/components/box/MuiBox";
import { MuiButton } from "src/common/components/button/MuiButtons/MuiButton";
import MuiDatePicker from "src/common/components/datepicker/MuiDatePicker";
import MuiGrid from "src/common/components/grid/MuiGrid";
import { MuiTextField } from "src/common/components/input/MuiInputs";
import { MuiMenuItem } from "src/common/components/menu/MuiMenu";
import { CustomModal } from "src/common/components/modal/MuiModal/CustomModal";
import MuiSelect from "src/common/components/select/MuiSelect";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import {
  instrumentTypes,
  optionType,
  POSITION_MODES,
  supportedInstrumentTypes,
  supportedSOUTypes,
  undTypes,
} from "src/common/constants/sytheticPortfolioConstants";
import { errorPrefix } from "src/common/constants/testids";
import {
  validateMaturityDate,
  validateStrike,
} from "src/common/utilities/ValidationUtils/ValidationUtils";
import { getYYYYMMDDFormattedDateString } from "src/common/utilities/formatUtils/dateUtils";
import { getErrorMessageFromError } from "src/common/utilities/globalUtils";
import { portfolioEditTextBoxStyle } from "src/common/utilities/styleUtils/batchConfigStyles";
import {
  useLazyAddPositionQuery,
  useLazyUpdatePositionQuery,
} from "src/queries/portfolioSetupApi";
import { ErrorType } from "src/types/apiErrorTypes";
import {
  gridResponseType,
  newPortfolioNameResponseType,
  positionAddRequestType,
  positionEditRequestType,
} from "src/types/syntheticPortfolioTypes";

export interface PortfolioEditProps {
  isModalOpen: boolean;
  onModalClose: () => void;
  selectedPortfolio: gridResponseType[] | undefined;
  portfolioName: newPortfolioNameResponseType | undefined;
  existingPortfolio: string;
  positionUpate: (gridData: gridResponseType[] | undefined) => void;
  groupId: number;
  gridApi: GridApi<any> | null;
  positionMode: string;
}

const PositionsEdit = (portfolioEditProps: PortfolioEditProps) => {
  const {
    isModalOpen,
    onModalClose,
    selectedPortfolio,
    portfolioName,
    existingPortfolio,
    positionUpate,
    groupId,
    gridApi,
    positionMode,
  } = portfolioEditProps;

  const [updatePortfolioDataTrigger] = useLazyUpdatePositionQuery();
  const [addPositionDataTrigger] = useLazyAddPositionQuery();
  const [selectedQuantity, setSelectedQuantity] = useState<string>("");
  const [selectedStrike, setSelectedStrike] = useState<number | null>(null);
  const [selectedOptionsType, setSelectedOptionsType] = useState<
    string | undefined
  >(selectedPortfolio ? selectedPortfolio[0]?.option_type : "");
  const [selectedSymbolPair, setSelectedSymbolPair] = useState<string | "">(
    selectedPortfolio ? selectedPortfolio[0]?.symbol_pair : ""
  );
  const [selectedMaturityDate, setSelectedMaturityDate] =
    useState<Dayjs | null>(null);
  const [selectedUndType, setSelectedUndType] = useState<string>(
    selectedPortfolio ? selectedPortfolio[0]?.und_type : ""
  );
  const [selectedInsrumentType, setSelectedInstrumentType] = useState<string>();

  const isSupportedInstrumentType =
    typeof selectedInsrumentType !== "undefined" &&
    supportedInstrumentTypes.includes(
      selectedInsrumentType?.toLocaleLowerCase()
    );
  const isSupportedSOUType =
    typeof selectedInsrumentType !== "undefined" &&
    supportedSOUTypes.includes(selectedInsrumentType?.toLocaleLowerCase());

  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedQuantity(event.target.value);
  };

  const handlenewStrikeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedStrike(Number(event.target.value));
  };

  const handleOptionsTypeChange = (event: SelectChangeEvent<unknown>) => {
    setSelectedOptionsType(event.target.value as string);
  };

  const handleSymbolPairChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedSymbolPair(event.target.value);
  };

  const handleUndTypeChange = (event: SelectChangeEvent<unknown>) => {
    setSelectedUndType(event.target.value as string);
  };

  const handleMaturityDate = (date: Dayjs | null) => {
    setSelectedMaturityDate(date);
  };

  const handleInstrumentChange = (event: SelectChangeEvent<unknown>) => {
    setSelectedInstrumentType(event.target.value as string);
  };

  const updatePositionSave = (portfolio: positionEditRequestType) => {
    updatePortfolioDataTrigger(portfolio)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: gridResponseType[] | undefined;
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
          positionUpate(d.data);
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

  const addPositionSave = (portfolio: positionAddRequestType) => {
    addPositionDataTrigger(portfolio)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: gridResponseType[] | undefined;
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
          positionUpate(d.data);
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

  const savePortfolio = () => {
    let isMaturityDateValid = false;
    let isStrikeValid = false;
    if (selectedInsrumentType !== undefined) {
      isMaturityDateValid = validateMaturityDate(
        selectedInsrumentType,
        selectedMaturityDate
      );
      isStrikeValid = validateStrike(selectedInsrumentType, selectedStrike);
    }
    if (positionMode === POSITION_MODES.EDIT) {
      if (selectedPortfolio !== undefined) {
        if (
          isMaturityDateValid &&
          isStrikeValid &&
          selectedSymbolPair.length > 0 &&
          selectedQuantity !== null
        ) {
          const portfolioEditParams: positionEditRequestType = {
            position_key: selectedPortfolio[0].position_key,
            run_id: selectedPortfolio[0].run_id,
            instrument_type: selectedPortfolio[0].instrument_type,
            quantity: selectedQuantity,
            Strike: selectedStrike,
            Option_type: selectedOptionsType,
            Symbol_pair: selectedSymbolPair,
            Und_type: selectedUndType,
            maturity_date: getYYYYMMDDFormattedDateString(
              selectedMaturityDate as Dayjs
            ),
            group_id: groupId,
          };
          updatePositionSave(portfolioEditParams);
          gridApi?.deselectAll();
          onModalClose();
        }
      }
    } else if (selectedInsrumentType !== undefined) {
      if (
        isMaturityDateValid &&
        selectedSymbolPair.length > 0 &&
        selectedQuantity !== null &&
        isStrikeValid
      ) {
        const maturitytdate =
          selectedMaturityDate !== null
            ? getYYYYMMDDFormattedDateString(selectedMaturityDate as Dayjs) //eslint-disable-line
            : "";

        const qty = selectedQuantity.length !== 0 ? selectedQuantity : "";
        const portfolioAddParams: positionAddRequestType = {
          run_id: Number(sessionStorage.getItem("portfolioId")),
          instrument_type: selectedInsrumentType,
          quantity: qty,
          Strike: selectedStrike,
          Option_type: selectedOptionsType,
          Symbol_pair: selectedSymbolPair,
          Und_type: selectedUndType,
          maturity_date: maturitytdate,
          group_id: groupId,
        };
        addPositionSave(portfolioAddParams);
        onModalClose();
      } else {
        SnackBarUtils.warning("All fields are mandatory", snackbarOption);
      }
    } else {
      SnackBarUtils.warning("Please select instrument type", snackbarOption);
    }
  };

  useEffect(() => {
    if (
      positionMode === POSITION_MODES.EDIT &&
      selectedPortfolio !== undefined
    ) {
      setSelectedQuantity(selectedPortfolio[0].quantity.toString());
      setSelectedStrike(selectedPortfolio[0].strike);
      setSelectedOptionsType(selectedPortfolio[0].option_type);
      setSelectedSymbolPair(selectedPortfolio[0].symbol_pair);
      setSelectedMaturityDate(dayjs(selectedPortfolio[0].maturity_date));
      setSelectedUndType(selectedPortfolio[0].und_type);
      setSelectedInstrumentType(selectedPortfolio[0].instrument_type);
    } else {
      setSelectedQuantity("");
      setSelectedStrike(null);
      setSelectedOptionsType(undefined);
      setSelectedSymbolPair("");
      setSelectedMaturityDate(null);
      setSelectedUndType("");
    }
  }, [positionMode, selectedPortfolio]);

  return (
    <CustomModal
      key={"porfolioEditModal"}
      isOpen={isModalOpen}
      handleClose={onModalClose}
      headerClassName="tw-text-xl tw-font-bold "
      title={
        <MuiBox className="tw-flex tw-text-md tw-font-bold">
          <MuiTypography>
            {positionMode === POSITION_MODES.ADD ? "Add : " : "Edit : "}
          </MuiTypography>
          <MuiTypography className="tw-ml-1 ">
            {portfolioName !== undefined
              ? portfolioName?.portfolio_name
              : existingPortfolio}
          </MuiTypography>
        </MuiBox>
      }
      maxWidth="md"
    >
      <MuiBox className="tw-p-4">
        <MuiGrid container direction="column" spacing={2} className="tw-w-full">
          {positionMode === POSITION_MODES.ADD && (
            <div className="tw-flex tw-items-center tw-w-full tw-mb-2">
              <MuiBox className="tw-flex tw-items-center tw-w-full">
                <MuiTypography className="tw-text-sm tw-w-24 ">
                  Instrument type:
                </MuiTypography>
                <MuiSelect
                  data-testid="instrumentTypeSelect"
                  id="instrumenttype"
                  name="INSTRUMENTTYPE"
                  value={
                    selectedInsrumentType !== undefined
                      ? selectedInsrumentType
                      : ""
                  }
                  onChange={handleInstrumentChange}
                  className="tw-w-36 tw-text-md tw-py-1 tw-px-2 tw-text-left "
                  style={{ height: "30px", width: "132px" }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        width: "144px",
                        height: "auto",
                        maxHeight: "160px",
                      },
                    },
                  }}
                >
                  {instrumentTypes.map((type: string) => (
                    <MuiMenuItem key={type} value={type} className="tw-text-sm">
                      {type}
                    </MuiMenuItem>
                  ))}
                </MuiSelect>
              </MuiBox>
            </div>
          )}

          {isSupportedSOUType && (
            <MuiBox className="tw-w-full">
              <div className="tw-flex tw-items-center tw-w-full tw-mb-2">
                <MuiBox className="tw-flex tw-items-center tw-w-full">
                  <MuiTypography className="tw-text-sm tw-w-24">
                    Strike :
                  </MuiTypography>
                  <MuiTextField
                    type="number"
                    sx={portfolioEditTextBoxStyle}
                    value={selectedStrike}
                    onChange={handlenewStrikeChange}
                  />
                </MuiBox>
              </div>
              <div className="tw-flex tw-items-center tw-w-full tw-mb-2">
                <MuiBox className="tw-flex tw-items-center tw-w-full">
                  <MuiTypography className="tw-text-sm tw-w-24">
                    Option type :
                  </MuiTypography>
                  <MuiSelect
                    data-testid="optionTypeSelect"
                    id="optionType"
                    name="optionType"
                    value={
                      selectedOptionsType !== undefined
                        ? selectedOptionsType
                        : undefined
                    }
                    onChange={handleOptionsTypeChange}
                    className="tw-w-36 tw-text-md tw-py-1 tw-px-2 tw-text-left "
                    style={{ height: "30px", width: "132px" }}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          width: "144px",
                          height: "auto",
                        },
                      },
                    }}
                  >
                    {optionType.map((type: string) => (
                      <MuiMenuItem
                        key={type}
                        value={type}
                        className="tw-text-sm"
                      >
                        {type}
                      </MuiMenuItem>
                    ))}
                  </MuiSelect>
                </MuiBox>
              </div>
              <div className="tw-flex tw-items-center tw-w-full tw-mb-2">
                <MuiBox className="tw-flex tw-items-center">
                  <MuiTypography className="tw-text-sm tw-w-24 ">
                    Und type:
                  </MuiTypography>
                  <MuiSelect
                    data-testid="undTypeSelect"
                    id="undType"
                    name="undType"
                    value={selectedUndType}
                    onChange={handleUndTypeChange}
                    className="tw-w-36 tw-text-md tw-py-1 tw-px-2 tw-text-left "
                    style={{ height: "30px", width: "132px" }}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          width: "144px",
                          height: "auto",
                        },
                      },
                    }}
                  >
                    {undTypes.map((type: string) => (
                      <MuiMenuItem
                        key={type}
                        value={type}
                        className="tw-text-sm"
                      >
                        {type}
                      </MuiMenuItem>
                    ))}
                  </MuiSelect>
                </MuiBox>
              </div>
            </MuiBox>
          )}
          {isSupportedInstrumentType && (
            <div className="tw-flex tw-items-center tw-w-full tw-mb-2">
              <MuiBox className="tw-flex tw-items-center tw-w-full">
                <MuiTypography className="tw-text-sm tw-w-24">
                  Maturity date :
                </MuiTypography>
                <MuiDatePicker
                  value={selectedMaturityDate}
                  onChange={handleMaturityDate}
                  fontSize={14}
                  width={80}
                />
              </MuiBox>
            </div>
          )}
          <div className="tw-flex tw-items-center tw-w-full tw-mb-2">
            <MuiBox className="tw-flex tw-items-center tw-w-full">
              <MuiTypography className="tw-text-sm tw-w-24">
                Symbol pair :
              </MuiTypography>
              <MuiTextField
                sx={portfolioEditTextBoxStyle}
                value={selectedSymbolPair.length > 0 ? selectedSymbolPair : ""}
                onChange={handleSymbolPairChange}
              />
            </MuiBox>
          </div>
          <div className="tw-flex tw-items-center tw-w-full tw-mb-2">
            <MuiBox className="tw-flex tw-items-center tw-w-full">
              <MuiTypography className="tw-text-sm tw-w-24">
                Quantity :
              </MuiTypography>
              <MuiTextField
                sx={portfolioEditTextBoxStyle}
                value={selectedQuantity !== null ? selectedQuantity : null}
                onChange={handleQuantityChange}
              />
            </MuiBox>
          </div>
        </MuiGrid>
      </MuiBox>

      <MuiBox className="tw-flex tw-justify-end tw-mt-1">
        <MuiButton
          className="tw-m-1 tw-bg-slate-75 tw-text-sm"
          onClick={savePortfolio}
        >
          Save
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

export default PositionsEdit;
