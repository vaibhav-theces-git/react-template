import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  MuiTable,
  MuiTableBody,
  MuiTableCell,
  MuiTableContainer,
  MuiTableRow,
} from "src/common/components/muiTable";
import { MuiPopover } from "src/common/components/popover/MuiPopover";
import { MuiTab, MuiTabs } from "src/common/components/tab/index";
import { MuiIconButton } from "src/common/components/button/MuiButtons/MuiIconButton";
import { MuiBox } from "src/common/components/box/MuiBox";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import { CustomModal } from "src/common/components/modal/MuiModal/CustomModal";
import SnackBarUtils, {
  snackbarOption,
} from "src/common/components/SnackBarUtilsConfigurator";
import { useGlobalNotificationState, useRunId } from "src/globalRunId";
import { useLazyGetMissingPricesQuery } from "src/queries/missingPricessApi";
import { useLazyPortfolioDetailsQuery } from "src/queries/portfolioDetailsApi";
import {
  MissingPricesResponseType,
  MissingPricesRequestType,
} from "src/types/missingPricesTypes";
import {
  PortfolioDetailRequestType,
  PortfolioDetailResponseType,
} from "src/types/PortfolioDetailsType";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ITooltipParams } from "ag-grid-enterprise";
import { MuiButton } from "src/common/components/button/MuiButtons/MuiButton";
import { Download } from "@mui/icons-material";
import { formattedDateTime } from "src/common/utilities/formatUtils/dateUtils";
import { batchDataDownloadRequestType } from "src/types/batchDataDownloadRequestType";
import { useLazyBatchDataDownloadQuery } from "src/queries/batchDataDownlaod";
import { errorPrefix } from "src/common/constants/testids";
import MissingDatesTooltip from "./MissingDatesTooltip";

const infoData = [
  {
    id: 1,
    notificationNo: 1,
    data: "Batch Market Data Status",
    rowIndex: 1,
  },
  {
    id: 2,
    notificationNo: 2,
    data: "Portfolio Details",
    rowIndex: 2,
  },
  {
    id: 3,
    notificationNo: 3,
    data: "Batch Data Download",
    rowIndex: 3,
  },
];

export interface NotificationProps {
  path: string;
}
const Notification = (notificationProps: NotificationProps) => {
  const { path } = notificationProps;
  const { globalRunId } = useRunId(0);
  const { globalNotificationState } = useGlobalNotificationState(false);
  const gridRef = useRef<AgGridReact>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [informationList] = useState(infoData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [missingPricesData, setMissingPricesData] = useState<
    MissingPricesResponseType[]
  >([]);
  const [portfolioDetails, setPortfolioDetails] = useState<
    PortfolioDetailResponseType[]
  >([]);
  const [missingPriceTrigger] = useLazyGetMissingPricesQuery();
  const [portfolioDetailsTrigger] = useLazyPortfolioDetailsQuery();
  const [batchDataTrigger] = useLazyBatchDataDownloadQuery();

  const getMissingPrices = () => {
    const missingPricesParams: MissingPricesRequestType = {
      run_id: globalRunId,
    };
    missingPriceTrigger(missingPricesParams)
      .then((resp) => resp.data)
      .then((data) => {
        setMissingPricesData(data as MissingPricesResponseType[]);
      })
      .catch((e) => {
        setMissingPricesData([]);
        SnackBarUtils.error(
          `Error occured while fetching missingPricesData. Technical Error:`.concat(
            e
          ),
          snackbarOption
        );
      });
  };
  const getPorfolioDetails = () => {
    const positionDetailsParams: PortfolioDetailRequestType = {
      run_id: globalRunId,
    };
    portfolioDetailsTrigger(positionDetailsParams)
      .then((resp) => resp.data)
      .then((data) => {
        setPortfolioDetails(data as PortfolioDetailResponseType[]);
      })
      .catch((e) => {
        setMissingPricesData([]);
        SnackBarUtils.error(
          `Error occured while fetching missingPricesData. Technical Error:`.concat(
            e
          ),
          snackbarOption
        );
      });
  };
  const getBatchData = (runId: number) => {
    const positionDetailsParams: batchDataDownloadRequestType = {
      run_id: runId,
    };
    batchDataTrigger(positionDetailsParams)
      .then((resp) => {
        if (runId !== undefined && resp.status === "fulfilled") {
          const blb = new Blob([resp.data], { type: "application/zip" });
          const fileurl = window.URL.createObjectURL(blb);
          const link = document.createElement("a");
          link.href = fileurl;
          link.download = `Batch_Data_${globalRunId}_${formattedDateTime()}_`;
          link.click();
        } else {
          SnackBarUtils.warning("No Batch Data available", snackbarOption);
        }
      })

      .catch((e) => {
        const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
        SnackBarUtils.error(errorMsg, snackbarOption);
      });
  };

  const handleModal = (rowIndex: number, data: string) => {
    if (data === infoData[2].data) {
      getBatchData(globalRunId);
    } else {
      setSelectedRowIndex(rowIndex);
      setIsModalOpen(!isModalOpen);
    }
  };

  const openPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    getMissingPrices();
    getPorfolioDetails();
  };

  const closePopover = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    tabIndex: React.SetStateAction<number>
  ) => {
    setCurrentTabIndex(tabIndex);
  };

  useEffect(() => {}, [globalRunId]);

  const gridStyle = useMemo(() => ({ height: "400px", width: "1100px" }), []);
  const missingPriciesColumnDefs: ColDef[] = [
    {
      field: "symbol",
      headerName: "Symbol",
      minWidth: 200,
      wrapHeaderText: true,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 200,
      wrapHeaderText: true,
    },
    {
      field: "missing_count",
      headerName: "Missing Count",
      minWidth: 100,
      wrapHeaderText: true,
      type: "numericColumn",
    },
    {
      field: "missing_dates",
      headerName: "Missing Dates",
      minWidth: 500,
      wrapHeaderText: true,
      tooltipValueGetter: (params: ITooltipParams) => {
        const dates = params.data as { missing_dates: string };
        const datesString = dates.missing_dates;
        return datesString === "No Market Data Available"
          ? null
          : (params.value as string[]);
      },
    },
  ];
  const porfolioDetailsColumnDefs: ColDef[] = [
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
      tooltipComponent: MissingDatesTooltip,
    };
  }, []);

  const positionDetailsDataExport = useCallback(() => {
    const excelParams = {
      fileName: `Position_Details_${globalRunId}_${formattedDateTime()}_.csv`,
    };
    gridRef?.current?.api?.exportDataAsCsv(excelParams);
  }, [gridRef, globalRunId]);

  const missingDatesDataExport = useCallback(() => {
    const excelParams = {
      fileName: `Missing_Dates_${globalRunId}_${formattedDateTime()}_.csv`,
    };
    gridRef?.current?.api?.exportDataAsCsv(excelParams);
  }, [gridRef, globalRunId]);

  return (
    <div>
      <MuiBox>
        <MuiIconButton
          size="medium"
          onClick={openPopover}
          disabled={path !== "/" || globalNotificationState}
        >
          <NotificationsIcon />
        </MuiIconButton>
        <MuiPopover
          open={Boolean(anchorEl)}
          onClose={closePopover}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          className="tw-mt-1.5 "
        >
          <MuiTabs
            value={currentTabIndex}
            onChange={handleTabChange}
            sx={{
              position: "fixed",
              backgroundColor: "#1E293B",
              width: 300,
              overflow: "hidden",
            }}
          >
            <MuiTab label="Information" className="tw-text-xs tw-normal-case" />
            <MuiTab label="Warnings" className="tw-text-xs tw-normal-case" />
            <MuiTab label="Errors" className="tw-text-xs tw-normal-case" />
          </MuiTabs>
          {currentTabIndex === 0 && (
            <MuiBox
              sx={{
                maxHeight: 250,
                width: 300,
                marginTop: 6,
                overflow: "auto",
                padding: "5px",
                backgroundColor: "#141A2A",
              }}
            >
              <MuiTableContainer>
                <MuiTable
                  sx={{
                    minWidth: 100,
                    backgroundColor: "#141A2A",
                  }}
                  size="small"
                  aria-label="a dense table"
                >
                  {informationList.map((data) => (
                    <MuiTableBody
                      className={`${
                        selectedRowIndex === data.rowIndex
                          ? "tw-bg-slate-200"
                          : ""
                      }`}
                      key={data.rowIndex}
                    >
                      <MuiTableRow
                        key={data.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          margin: "10px",
                          maxHeight: "35px",
                          overflowY: "auto",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          position: "relative",
                          cursor: "pointer",
                        }}
                        onClick={() => handleModal(data.rowIndex, data.data)}
                      >
                        <MuiTableCell
                          align="left"
                          className="tw-text-xs"
                          sx={{
                            marginRight: "30px",
                            padding: "6px",
                          }}
                        >
                          {data.data}
                        </MuiTableCell>
                        <MuiTableCell align="right" className="tw-text-xs">
                          ...
                        </MuiTableCell>
                      </MuiTableRow>
                    </MuiTableBody>
                  ))}
                </MuiTable>
              </MuiTableContainer>
            </MuiBox>
          )}
          {currentTabIndex === 1 && (
            <MuiBox
              sx={{
                maxHeight: 250,
                width: 300,
                marginTop: 6,
                overflow: "auto",
                padding: "5px",
                backgroundColor: "#141A2A",
              }}
            >
              <MuiTableContainer>
                <MuiTable
                  sx={{
                    minWidth: 100,
                    backgroundColor: "#141A2A",
                  }}
                  size="small"
                  aria-label="a dense table"
                >
                  <MuiTypography className="tw-text-center tw-text-xs">
                    No Data
                  </MuiTypography>
                </MuiTable>
              </MuiTableContainer>
            </MuiBox>
          )}
          {currentTabIndex === 2 && (
            <MuiBox
              sx={{
                maxHeight: 250,
                width: 300,
                marginTop: 6,
                overflow: "auto",
                padding: "5px",
                backgroundColor: "#141A2A",
              }}
            >
              <MuiTableContainer>
                <MuiTable
                  sx={{
                    minWidth: 100,
                    backgroundColor: "#141A2A",
                  }}
                  size="small"
                  aria-label="a dense table"
                >
                  <MuiTypography className="tw-text-center tw-text-xs">
                    No Data
                  </MuiTypography>
                </MuiTable>
              </MuiTableContainer>
            </MuiBox>
          )}
        </MuiPopover>
      </MuiBox>
      {
        <CustomModal
          isOpen={isModalOpen}
          handleClose={handleModal}
          title={
            selectedRowIndex === 1 ? (
              <MuiBox className="tw-grid-cols-1 tw-flex tw-justify-between">
                <MuiBox className="tw-grid-cols-6">Notifications </MuiBox>
                <MuiBox className="tw-grid-cols-6">
                  <MuiButton>
                    <MuiIconButton
                      size="small"
                      onClick={missingDatesDataExport}
                    >
                      <Download />
                    </MuiIconButton>
                  </MuiButton>
                </MuiBox>
              </MuiBox>
            ) : (
              <MuiBox className="tw-grid-cols-1 tw-flex tw-justify-between">
                <MuiBox className="tw-grid-cols-6">Portfolio Details </MuiBox>
                <MuiBox className="tw-grid-cols-6">
                  <MuiButton>
                    <MuiIconButton
                      size="small"
                      onClick={positionDetailsDataExport}
                    >
                      <Download />
                    </MuiIconButton>
                  </MuiButton>
                </MuiBox>
              </MuiBox>
            )
          }
          maxWidth="lg"
          classNames="notificationmodal"
        >
          {selectedRowIndex === 1 && missingPricesData && (
            <MuiBox style={gridStyle} className="ag-theme-alpine">
              <AgGridReact
                rowData={missingPricesData}
                columnDefs={missingPriciesColumnDefs}
                defaultColDef={defaultColDef}
                ref={gridRef}
                suppressExcelExport
                suppressContextMenu
                paginationPageSize={7}
                paginationPageSizeSelector={false}
                pagination
                suppressDragLeaveHidesColumns
                tooltipShowDelay={0}
                tooltipInteraction
              />
            </MuiBox>
          )}
          {selectedRowIndex === 2 && portfolioDetails && (
            <MuiBox style={gridStyle} className="ag-theme-alpine">
              <AgGridReact
                rowData={portfolioDetails}
                columnDefs={porfolioDetailsColumnDefs}
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
          )}
        </CustomModal>
      }
    </div>
  );
};

export default Notification;
