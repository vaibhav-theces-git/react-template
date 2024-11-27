import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MuiGrid from "src/common/components/grid/MuiGrid";
import MuiSelect from "src/common/components/select/MuiSelect";
import MuiToolbar from "src/common/components/toolbar/MuiToolbar";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import { SelectChangeEvent } from "@mui/material";
import { MuiMenuItem } from "src/common/components/menu/MuiMenu";
import MuiContainer from "src/common/components/container/MuiContainer";
import { MuiBox } from "src/common/components/box/MuiBox";
import { MuiButton } from "src/common/components/button/MuiButtons/MuiButton";
import { MuiIconButton } from "src/common/components/button/MuiButtons/MuiIconButton";
import { Download } from "@mui/icons-material";
import SnackBarUtils, {
  snackbarOption,
} from "src/common/components/SnackBarUtilsConfigurator";
import { CustomModal } from "src/common/components/modal/MuiModal/CustomModal";
import { useLazyVarBackTestPortfolioQuery } from "src/queries/varBackTestPortfolioApi";
import {
  varBackTestDataRequestType,
  varBackTestDataResponseType,
  varBackTestPortfolioResponseType,
} from "src/types/varBackTestType";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { getErrorMessageFromError } from "src/common/utilities/globalUtils";
import { errorPrefix } from "src/common/constants/testids";
import { ErrorType } from "src/types/apiErrorTypes";
import { useLazyGetVarBackTestDataQuery } from "src/queries/varBackTestDataApi";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-enterprise";
import {
  PortfolioDetailRequestType,
  PortfolioDetailResponseType,
} from "src/types/PortfolioDetailsType";
import { useLazyPortfolioDetailsQuery } from "src/queries/portfolioDetailsApi";
import { formattedDateTime } from "src/common/utilities/formatUtils/dateUtils";
import VaRBackTestVector from "./VaRBackTestVector";
import VaRBackTestChart from "./VaRBackTestChart";
import { varLevels } from "./varLevels";

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 200,
    },
  },
};

const VarBackTesting = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [zoomedGridItemNo, setZoomedGridItemNo] = useState<number>(0);
  const [varBackTestPortfolio, setVarBackTestPortfolio] = useState<
    varBackTestPortfolioResponseType[]
  >([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(
    varBackTestPortfolio && varBackTestPortfolio.length > 0
      ? varBackTestPortfolio[0].portfolio_name
      : 0
  );
  const [selectedPortfolioRunId, setSelectedPortfolioRunId] =
    useState<number>(0);
  const [varLevel, setSelectedVaRLevel] = useState(varLevels.data[0].varLevel);
  const [varBackTestData, setVarBackTestData] = useState<
    varBackTestDataResponseType[]
  >([]);
  const [portfolioDetails, setPortfolioDetails] = useState<
    PortfolioDetailResponseType[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const gridStyle = useMemo(() => ({ height: "400px", width: "1100px" }), []);
  const columnDefs: ColDef[] = [
    {
      field: "legal_entity",
      headerName: "Legal Entity",
      minWidth: 300,
      wrapHeaderText: true,
    },
    {
      field: "account_id",
      headerName: "Account Id",
      minWidth: 300,
      wrapHeaderText: true,
    },
    {
      field: "pos_datetime",
      headerName: "Position Date",
      minWidth: 150,
      wrapHeaderText: true,
      type: "numericColumn",
    },
    {
      field: "sec_key",
      headerName: "Secret Key",
      minWidth: 100,
      wrapHeaderText: true,
      type: "numericColumn",
    },

    {
      field: "quantity",
      headerName: "Quantity",
      minWidth: 150,
      wrapHeaderText: true,
      type: "numericColumn",
    },
    {
      field: "maturity_date",
      headerName: "Maturity Date",
      minWidth: 150,
      wrapHeaderText: true,
      type: "numericColumn",
    },
    {
      field: "position_price",
      headerName: "Position Price",
      minWidth: 150,
      wrapHeaderText: true,
      type: "numericColumn",
    },
    {
      field: "error_codes",
      headerName: "Error Code",
      minWidth: 300,
      wrapHeaderText: true,
    },
    {
      field: "position_key",
      headerName: "Position Key",
      minWidth: 150,
      wrapHeaderText: true,
      type: "numericColumn",
    },
    {
      field: "instrument_name",
      headerName: "Instrument Name",
      minWidth: 300,
      wrapHeaderText: true,
    },
    {
      field: "symbol_pair",
      headerName: "Symbol Pair",
      minWidth: 150,
      wrapHeaderText: true,
    },
    {
      field: "instrument_type",
      headerName: "Instrument_type Type",
      minWidth: 150,
      wrapHeaderText: true,
    },
    {
      field: "und_price",
      headerName: "UnD Price",
      minWidth: 200,
      wrapHeaderText: true,
      type: "numericColumn",
    },
    {
      field: "contract_price",
      headerName: "Contract Price",
      minWidth: 150,
      wrapHeaderText: true,
      type: "numericColumn",
    },
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      menuTabs: ["generalMenuTab", "filterMenuTab"],
      suppressLoadingOverlay: true,
    };
  }, []);

  const onBtnExport = useCallback(() => {
    const excelParams = {
      fileName: `VaRBackTest_Position_Details_${selectedPortfolioRunId}_${formattedDateTime()}.csv`,
    };
    gridRef?.current?.api?.exportDataAsCsv(excelParams);
  }, [gridRef, selectedPortfolioRunId]);

  const handleVaRLevelChange = (event: SelectChangeEvent<unknown>) => {
    setSelectedVaRLevel(event.target.value as any);
  };
  const handleToggleBlock1 = (enableZoom: boolean) => {
    window.dispatchEvent(new Event("resize"));
    if (enableZoom) setZoomedGridItemNo(1);
    else setZoomedGridItemNo(0);
  };
  const handleToggleBlock2 = (enableZoom: boolean) => {
    window.dispatchEvent(new Event("resize"));
    if (enableZoom) setZoomedGridItemNo(2);
    else setZoomedGridItemNo(0);
  };

  const [varBackTestDataTrigger] = useLazyGetVarBackTestDataQuery();
  const getVaRBackTestData = useCallback(
    (batchId: any) => {
      const varBackTestParams: varBackTestDataRequestType = {
        batch_id: batchId,
      };
      varBackTestDataTrigger(varBackTestParams)
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
            setVarBackTestData(d.data as varBackTestDataResponseType[]);
            setSelectedVaRLevel(varLevels.data[0].varLevel);
          } else {
            SnackBarUtils.warning(
              "No VaR Back Testing Data available",
              snackbarOption
            );
          }
        })
        .catch((e) => {
          const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
          SnackBarUtils.error(errorMsg, snackbarOption);
        });
    },
    [varBackTestDataTrigger]
  );
  const [varBackTestPortfolioTrigger] = useLazyVarBackTestPortfolioQuery();
  const getVaRBackTestPortfolio = useCallback(() => {
    varBackTestPortfolioTrigger()
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: varBackTestPortfolioResponseType[] | undefined;
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
          const portfolioList = d.data as varBackTestPortfolioResponseType[];
          if (portfolioList.length === 0) {
            // Empty Portfolio List
          } else {
            setVarBackTestPortfolio(portfolioList);
            setSelectedPortfolio(portfolioList[0].batch_id);
            setSelectedPortfolioRunId(portfolioList[0].run_id);
            getVaRBackTestData(portfolioList[0].batch_id);
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
  }, [varBackTestPortfolioTrigger, getVaRBackTestData]);

  const [varBackTestPortfolioDetailsTrigger] = useLazyPortfolioDetailsQuery();
  const getPorfolioDetails = (runId: number) => {
    const portfolioDetailsParams: PortfolioDetailRequestType = {
      run_id: runId,
    };
    varBackTestPortfolioDetailsTrigger(portfolioDetailsParams)
      .then((resp) => resp.data)
      .then((data) => {
        setPortfolioDetails(data as PortfolioDetailResponseType[]);
      })
      .catch((e) => {
        SnackBarUtils.error(
          `Error occured while fetching missingPricesData. Technical Error:`.concat(
            e
          ),
          snackbarOption
        );
      });
  };

  const handlePortfolioChange = (event: SelectChangeEvent<unknown>) => {
    setSelectedPortfolio(event.target.value as number);
    setSelectedPortfolioRunId(
      varBackTestPortfolio.find(
        (v) => v.batch_id === (event.target.value as number)
      )?.run_id as number
    );
    getVaRBackTestData(event.target.value as number);
  };

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
    setPortfolioDetails([]);
    getPorfolioDetails(selectedPortfolioRunId);
  };

  useEffect(() => {
    getVaRBackTestPortfolio();
  }, [getVaRBackTestPortfolio]);

  return (
    <MuiContainer className="tw-w-fit tw-min-w-full tw-p-0 tw-h-[calc(100%-66px)] tw-max-h-screen  tw-m-0 tw-bg-slate-25">
      <MuiToolbar>
        <MuiGrid
          container
          item
          className="tw-grid md:tw-grid-cols-1 sm:tw-grid-cols-1 lg:tw-grid-cols-1 tw-grow"
        >
          <MuiGrid
            item
            className="tw-inline-flex  tw-m-1 tw-mt-2.5 md:tw-grid-cols-2 sm:tw-grid-cols-2 lg:tw-grid-cols-2 md:tw-justify-start lg:tw-justify-start sm:tw-justify-start"
            alignItems="center"
          >
            <MuiBox className="tw-flex">
              <MuiBox className="tw-flex tw-items-center ">
                <MuiTypography className="tw-text-sm tw-mr-1 tw-w-14">
                  Portfolio :
                </MuiTypography>
                <MuiSelect
                  labelId="ToolbarSelectVaRPortfolioLabel"
                  id="ToolbarSelectVaRPortfolioId"
                  value={selectedPortfolio}
                  defaultValue={selectedPortfolio}
                  onChange={handlePortfolioChange}
                  className="tw-w-96 tw-text-xs tw-py-3 tw-px-0 tw-text-left"
                  MenuProps={MenuProps}
                >
                  {varBackTestPortfolio &&
                    varBackTestPortfolio.map((p) => (
                      <MuiMenuItem
                        key={p.batch_id}
                        value={p.batch_id}
                        className="tw-text-xs"
                      >
                        {p.portfolio_name}
                      </MuiMenuItem>
                    ))}
                </MuiSelect>
              </MuiBox>
              <MuiBox className="tw-flex tw-items-center tw-ml-4">
                <MuiTypography className="tw-text-sm tw-mr-1 tw-w-8">
                  VaR :
                </MuiTypography>
                <MuiSelect
                  labelId="ToolbarSelectVaRPortfolioLabel"
                  id="ToolbarSelectVaRPortfolioId"
                  value={varLevel}
                  onChange={handleVaRLevelChange}
                  className="tw-w-24 tw-text-xs tw-py-3 tw-px-0 tw-text-left"
                  MenuProps={MenuProps}
                  disabled={varBackTestPortfolio.length === 0}
                >
                  {varLevels.data &&
                    varLevels.data.map((v) => (
                      <MuiMenuItem
                        key={v.id}
                        value={v.varLevel}
                        className="tw-text-xs"
                      >
                        {varBackTestPortfolio.length === 0 ? "" : v.varLevel}
                      </MuiMenuItem>
                    ))}
                </MuiSelect>
              </MuiBox>
              <MuiBox className="tw-flex tw-items-center tw-ml-4 tw-py-1 tw-px-1 tw-bg-orange-900 tw-rounded">
                <MuiTypography className="tw-text-sm tw-mr-1 ">
                  No Of Breaches :
                  {varLevel === "VAR-95"
                    ? varBackTestData.filter(
                        (breach95) => breach95.breach_95 !== null
                      ).length
                    : varBackTestData.filter(
                        (breach99) => breach99.breach_99 !== null
                      ).length}
                </MuiTypography>
              </MuiBox>
              <MuiBox className="tw-flex tw-items-center tw-ml-4 tw-p-0.5 tw-bg-slate-75 tw-rounded">
                <MuiButton
                  onClick={handleModal}
                  disabled={varBackTestPortfolio.length === 0}
                >
                  Portfolio Details
                </MuiButton>
              </MuiBox>
            </MuiBox>
          </MuiGrid>
        </MuiGrid>
      </MuiToolbar>
      <MuiGrid
        container
        item
        className={
          zoomedGridItemNo === 0
            ? "tw-grid lg:tw-grid-cols-12 md:tw-grid-cols-2 sm:tw-grid-cols-1 tw-grow tw-gap-px tw-h-full"
            : "tw-grid lg:tw-grid-cols-1 md:tw-grid-cols-1 sm:tw-grid-cols-1 tw-grow tw-gap-px tw-h-full"
        }
      >
        {(zoomedGridItemNo === 0 || zoomedGridItemNo === 1) && (
          <MuiGrid
            item
            className={
              zoomedGridItemNo === 1
                ? "tw-grow-0 tw-w-full lg:tw-col-span-4 md:tw-col-span-4 sm:tw-col-span-12 tw-bg-slate-50 tw-h-[calc(100%-90px)]"
                : "tw-grow-0 tw-w-full lg:tw-col-span-4 md:tw-col-span-4 sm:tw-col-span-12 tw-bg-slate-50 tw-h-full"
            }
          >
            <VaRBackTestVector
              varBackTestData={varBackTestData}
              togglecallback={handleToggleBlock1}
              selectedRunId={selectedPortfolioRunId}
              varLevel={varLevel}
            />
          </MuiGrid>
        )}
        {(zoomedGridItemNo === 0 || zoomedGridItemNo === 2) && (
          <MuiGrid
            item
            className={
              zoomedGridItemNo === 2
                ? "tw-grow-0 tw-w-full lg:tw-col-span-8 md:tw-col-span-8 sm:tw-col-span-12 tw-bg-slate-50 tw-h-full"
                : "tw-grow-0 tw-w-full lg:tw-col-span-8 md:tw-col-span-8 sm:tw-col-span-12  tw-bg-slate-50 tw-h-full"
            }
          >
            <VaRBackTestChart
              chartData={varBackTestData}
              togglecallback={handleToggleBlock2}
              varLevel={varLevel}
            />
          </MuiGrid>
        )}
      </MuiGrid>
      {
        <CustomModal
          isOpen={isModalOpen}
          handleClose={handleModal}
          title={
            <MuiBox className="tw-grid-cols-1 tw-flex tw-justify-between">
              <MuiBox className="tw-grid-cols-6">
                VaR Back Test Portfolio Details
              </MuiBox>
              <MuiBox className="tw-grid-cols-6">
                <MuiIconButton size="small" onClick={onBtnExport}>
                  <Download />
                </MuiIconButton>
              </MuiBox>
            </MuiBox>
          }
          maxWidth="lg"
          classNames="notificationmodal"
        >
          <MuiBox style={gridStyle} className="ag-theme-alpine">
            <AgGridReact
              rowData={portfolioDetails}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              ref={gridRef}
              suppressExcelExport
              suppressContextMenu
              paginationPageSize={7}
              paginationPageSizeSelector={false}
              pagination
              suppressDragLeaveHidesColumns
            />
          </MuiBox>
        </CustomModal>
      }
    </MuiContainer>
  );
};

export default VarBackTesting;
