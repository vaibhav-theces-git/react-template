import { useEffect, useReducer } from "react";
import {
  batchListResponseType,
  batchPositionsRequestType,
  batchPositionsResponseType,
  deletePositionRequestType,
  discardPortfolioRequestType,
  gridPortfolioByLeIdRequestType,
  gridPortfolioRequestType,
  gridPortfolioResponseType,
  gridResponseType,
  newPortfolioNameRequestType,
  newPortfolioNameResponseType,
  portfolioListResponseType,
  portfolioSaveResponsetype,
  portfoliStatusResponseType,
} from "src/types/syntheticPortfolioTypes";
import SnackBarUtils, {
  snackbarOption,
} from "src/common/components/SnackBarUtilsConfigurator";
import { MuiTab, MuiTabs } from "src/common/components/tab";
import { If } from "src/common/components/conditional";
import { GridApi } from "ag-grid-enterprise";
import {
  useLazyGetGridPortfolioPositionByLeIdQuery,
  useLazyGetGridPortfolioPositionByIdQuery,
  useLazyGetPortfolioListQuery,
  useLazyPortfoliosetupDataQuery,
  useLazyDeletePortfolioQuery,
  useLazyGetBatchListQuery,
  useLazyGetBatchPositionQuery,
  useLazyGetLatestGridPositionQuery,
} from "src/queries/portfolioSetupApi";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { getErrorMessageFromError } from "src/common/utilities/globalUtils";
import { ErrorType } from "src/types/apiErrorTypes";
import { errorPrefix } from "src/common/constants/testids";
import { LegalEntityPostType } from "src/types/batchConfigurationTypes";
import {
  JOB_STATUS,
  POSITION_MODES,
} from "src/common/constants/sytheticPortfolioConstants";
import {
  syntheticPortfolioreducer,
  sytheticPortfolioIntialState,
} from "./SyntheticPortfolioReducer";
import PortfolioControls from "./PortfolioControls";
import { PortfolioDataTable } from "./PortfolioDataTable";
import PortfolioSetup from "./PortfolioSetup";
import Results from "./Results";
import { Accounts } from "./Accounts";
import DiscardPortflio from "./DiscardPortflio";
import PositionsEdit from "./PositionsEdit";

const SyntheticPortfolio = () => {
  const [state, dispatch] = useReducer(
    syntheticPortfolioreducer,
    sytheticPortfolioIntialState
  );
  const [savePortfolioDataTrigger] = useLazyPortfoliosetupDataQuery();
  const [getPortfolioListDataTrigger] = useLazyGetPortfolioListQuery();
  const [
    getGridPortfolioPositionByIdTrigger,
    { isLoading: isPortfolioLoading },
  ] = useLazyGetGridPortfolioPositionByIdQuery();
  const [
    getGridPositonByLeIdTrigger,
    { isLoading: isAccountsPositionLoading },
  ] = useLazyGetGridPortfolioPositionByLeIdQuery();
  const [deletePortfolioTrigger] = useLazyDeletePortfolioQuery();
  const [getBatchListDataTrigger] = useLazyGetBatchListQuery();
  const [latestGridDataTrigger] = useLazyGetLatestGridPositionQuery();
  const [getBatchPositionsTrigger, { isLoading: isBatchPostionsLoading }] =
    useLazyGetBatchPositionQuery();

  const portfolioSetupSave = (portfolioName: string) => {
    const newportfolioNameSaveRequestParams: newPortfolioNameRequestType = {
      portfolio_name: portfolioName,
      portfolio_status: JOB_STATUS.WORKING,
    };
    savePortfolioDataTrigger(newportfolioNameSaveRequestParams)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: newPortfolioNameResponseType | undefined;
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
          dispatch({ type: "SET_PORFOLIO_RESP_NAME", payload: d.data });
          dispatch({
            type: "SET_SELECTED_EXISTING_PORTFOLIO_ID",
            payload: d?.data?.portfolio_id,
          });
          dispatch({
            type: "SET_GROUP_ID",
            payload: d?.data?.group_id,
          });

          sessionStorage.setItem(
            "portfolioId",
            d?.data?.portfolio_id.toString()
          );
          sessionStorage.setItem("portfolioName", d?.data?.portfolio_name);
          sessionStorage.setItem("groupId", d?.data?.group_id.toString()); // eslint-disable-line
          sessionStorage.setItem("jobStatus", d?.data?.status);
          SnackBarUtils.success(
            "Portfolio created successfully ",
            snackbarOption
          );
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

  const handleError = (error: string) => {
    const errorMsg = `${errorPrefix} Technical Error : ${error}`;
    SnackBarUtils.error(errorMsg, snackbarOption);
  };

  const getPortfolioList = () => {
    const getPortfolioListParams = {
      type: "main",
    };
    getPortfolioListDataTrigger(getPortfolioListParams)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: portfolioListResponseType[] | undefined;
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
          dispatch({ type: "SET_EXISTING_PORTFOLIO_LIST", payload: d.data });
        } else {
          const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
          SnackBarUtils.error(errorMsg, snackbarOption);
        }
      })
      .catch(handleError);
  };

  const getbatchList = () => {
    getBatchListDataTrigger()
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: batchListResponseType[] | undefined;
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
          dispatch({ type: "SET_BATCH_LIST", payload: d.data });
        } else {
          const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
          SnackBarUtils.error(errorMsg, snackbarOption);
        }
      })
      .catch(handleError);
  };

  const getbatchPositions = (
    selectedBatch: batchListResponseType | undefined
  ) => {
    const portfolioDetails =
      (selectedBatch?.portfolio_details?.portfolio as LegalEntityPostType[]) || // eslint-disable-line
      selectedBatch?.portfolio_details;
    const batchPositionParams: batchPositionsRequestType = {
      portfolio_name: selectedBatch?.portfolio_name,
      portfolio_details: portfolioDetails,
    };
    getBatchPositionsTrigger(batchPositionParams)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: batchPositionsResponseType[] | undefined;
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
          if (d.data !== undefined) {
            dispatch({
              type: "SET_SELECTED_EXISTING_PORTFOLIO_ID",
              payload: d.data[0].portfolio_id,
            });
            dispatch({
              type: "SET_SELECTED_EXISTING_PORTFOLIO",
              payload: d.data[0].portfolio_name,
            });
            dispatch({
              type: "SET_GRID_POSITIONS_DATA",
              payload: d.data[0].positions,
            });
            dispatch({
              type: "SET_GROUP_ID",
              payload: d.data[0].group_id,
            });

            sessionStorage.setItem("jobStatus", d.data[0].status);
            sessionStorage.setItem(
              "portfolioId",
              d.data[0].portfolio_id as unknown as string
            );
            sessionStorage.setItem(
              "groupId",
              d.data[0].group_id as unknown as string
            );
          } else {
            SnackBarUtils.warning("No data available", snackbarOption);
          }
        } else {
          const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
          SnackBarUtils.error(errorMsg, snackbarOption);
        }
      })
      .catch(handleError);
  };

  const getexistingPorfolioPositionsById = (portfolioId: number) => {
    const gridPortfolioParams: gridPortfolioRequestType = {
      portfolio_id: portfolioId,
    };
    getGridPortfolioPositionByIdTrigger(gridPortfolioParams)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: gridPortfolioResponseType | undefined;
          error: string;
        } = {
          status: resp.status,
          data: resp.data as unknown as gridPortfolioResponseType,
          error: getErrorMessageFromError(resp.error as ErrorType),
        };
        return respData;
      })
      .then((d) => {
        if (d.status === "fulfilled") {
          if (d.data !== undefined) {
            dispatch({
              type: "SET_SELECTED_EXISTING_PORTFOLIO_ID",
              payload: d.data.portfolio_id,
            });
            dispatch({
              type: "SET_GRID_POSITIONS_DATA",
              payload: d.data.positions,
            });
            dispatch({
              type: "SET_SELECTED_EXISTING_PORTFOLIO",
              payload: d.data.portfolio_name,
            });
            dispatch({
              type: "SET_GROUP_ID",
              payload: d.data.record_id,
            });

            sessionStorage.setItem(
              "portfolioId",
              d?.data?.portfolio_id as unknown as string
            );
            sessionStorage.setItem(
              "groupId",
              d.data.record_id as unknown as string
            );
            sessionStorage.setItem(
              "portfolioName",
              d.data.portfolio_name as unknown as string
            );
            sessionStorage.setItem(
              "jobStatus",
              d.data.status as unknown as string
            );
          } else {
            SnackBarUtils.warning("No data available", snackbarOption);
          }
        } else {
          const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
          SnackBarUtils.error(errorMsg, snackbarOption);
        }
      })
      .catch(handleError);
  };

  const getPorfolioPositionsByLeId = (portfolioId: number, leAccounts: any) => {
    const gridPortfolioParams: gridPortfolioByLeIdRequestType = {
      portfolio_id: portfolioId,
      le_accounts: leAccounts,
      group_id: state.groupId,
    };
    sessionStorage.setItem("portfolioId", portfolioId.toString());
    getGridPositonByLeIdTrigger(gridPortfolioParams)
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
          dispatch({ type: "SET_GRID_POSITIONS_DATA", payload: d.data });
        } else {
          const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
          SnackBarUtils.error(errorMsg, snackbarOption);
        }
      })
      .catch(handleError);
  };

  const getLatestGridData = (latestGridParams: discardPortfolioRequestType) => {
    const latestGridDataParams: discardPortfolioRequestType = {
      group_id: state.groupId || latestGridParams.group_id,
      portfolio_id:
        state.selectedExistingPortfolioId || latestGridParams.portfolio_id,
    };
    latestGridDataTrigger(latestGridDataParams)
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
          dispatch({ type: "SET_GRID_POSITIONS_DATA", payload: d.data });
        } else {
          const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
          SnackBarUtils.error(errorMsg, snackbarOption);
        }
      })
      .catch(handleError);
  };

  const handleTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    tabIndex: React.SetStateAction<number>
  ) => {
    dispatch({ type: "SET_CURRENT_TAB_INDEX", payload: tabIndex as number });
  };

  const addNewPortfolio = () => {
    const sessionPortfolioId = sessionStorage.getItem("portfolioId");
    const sessionPortfolioName = sessionStorage.getItem("portfolioName");
    if (
      (sessionPortfolioId && sessionPortfolioId?.length > 0) ||
      (sessionPortfolioName && sessionPortfolioName.length > 0)
    ) {
      dispatch({ type: "SET_IS_DISCARD_MODAL_OPEN", payload: true });
    } else {
      dispatch({ type: "SET_IS_SETUP_PORTFOLIO_OPEN", payload: true });
      getPortfolioList();
      getbatchList();
    }
  };

  const editPortfolio = () => {
    dispatch({ type: "SET_IS_PORTFOLIO_EDIT_OPEN", payload: true });
    dispatch({ type: "SET_MODE", payload: POSITION_MODES.EDIT });
  };

  const selectAccounts = () => {
    dispatch({ type: "SET_IS_SELECT_ACCOUNT_OPEN", payload: true });
  };

  const modalClose = () => {
    dispatch({ type: "SET_IS_SETUP_PORTFOLIO_OPEN", payload: false });
    dispatch({ type: "SET_IS_SELECT_ACCOUNT_OPEN", payload: false });
    dispatch({ type: "SET_IS_PORTFOLIO_EDIT_OPEN", payload: false });
    dispatch({ type: "SET_IS_DISCARD_MODAL_OPEN", payload: false });
    dispatch({ type: "SET_SELECTED_GRID_PORTFOLIO", payload: undefined });
    dispatch({ type: "SET_MODE", payload: "" });
    state.gridApi?.deselectAll();
  };

  const newPorfolioNameChange = (name: string) => {
    dispatch({ type: "SET_NEW_PORTFOLIO_NAME", payload: name });
  };

  const existingPortfolioSelection = (
    selectedPortfolio:
      | portfolioListResponseType
      | batchListResponseType
      | undefined,
    optionValue: number | null
  ) => {
    if (optionValue !== null) {
      dispatch({
        type: "SET_OPTION_VALUE",
        payload: optionValue,
      });
      sessionStorage.setItem("optionValue", optionValue.toString());
    }
    if (
      selectedPortfolio &&
      "portfolio_details" in selectedPortfolio // eslint-disable-line
    ) {
      dispatch({ type: "SET_SELECTED_BATCH", payload: selectedPortfolio });
      sessionStorage.setItem("portfolioName", selectedPortfolio.portfolio_name);
      sessionStorage.setItem(
        "portfolioDetails",
        JSON.stringify(selectedPortfolio.portfolio_details.portfolio) // eslint-disable-line
      );
    }
    dispatch({
      type: "SET_SELECTED_EXISTING_PORTFOLIO_ID",
      payload: selectedPortfolio?.portfolio_id as number,
    }); // eslint-disable-line
  };

  const gridPortfolioSelection = (
    portfolio: gridResponseType[] | undefined
  ) => {
    dispatch({ type: "SET_SELECTED_GRID_PORTFOLIO", payload: portfolio });
  };

  const portfolioSaveCallback = () => {
    if (state.newPortfolioName && state.newPortfolioName.length > 0) {
      dispatch({
        type: "SET_OPTION_VALUE",
        payload: 1,
      });
      sessionStorage.setItem("optionValue", "1");
      portfolioSetupSave(state.newPortfolioName);

      // eslint-disable-next-line
    } else if (state.selectedBatch?.portfolio_details.portfolio.length > 0) {
      getbatchPositions(state.selectedBatch as batchListResponseType);
    } else {
      getexistingPorfolioPositionsById(state.selectedExistingPortfolioId);
    }
    dispatch({ type: "SET_IS_SETUP_PORTFOLIO_OPEN", payload: false });
  };

  const portfolioCancelCallback = () => {
    dispatch({ type: "SET_EXISTING_PORTFOLIO_LIST", payload: undefined });
    dispatch({ type: "SET_IS_SETUP_PORTFOLIO_OPEN", payload: false });
  };

  const portfolioStatus = (status: portfoliStatusResponseType | undefined) => {
    dispatch({ type: "SET_STATUS", payload: status });
  };

  const discardPortfolio = () => {
    dispatch({ type: "SET_SELECTED_EXISTING_PORTFOLIO_ID", payload: 0 });
    dispatch({
      type: "SET_OPTION_VALUE",
      payload: null,
    });
    dispatch({ type: "SET_NEW_PORTFOLIO_NAME", payload: "" });
    dispatch({ type: "SET_GRID_POSITIONS_DATA", payload: [] });
    dispatch({ type: "SET_GROUP_ID", payload: 0 });
    dispatch({ type: "SET_SELECTED_EXISTING_PORTFOLIO", payload: "" });
    dispatch({ type: "SET_PORFOLIO_RESP_NAME", payload: undefined });
    dispatch({ type: "SET_SELECTED_BATCH", payload: undefined });
    dispatch({ type: "SET_STATUS", payload: undefined });
    sessionStorage.removeItem("portfolioId");
    sessionStorage.removeItem("groupId");
    sessionStorage.removeItem("jobStatus");
    sessionStorage.removeItem("portfolioName");
    sessionStorage.removeItem("portfolioDetails");
    sessionStorage.removeItem("optionvalue");
  };

  const saveAccountsCallback = (leAccounts: any[]) => {
    getPorfolioPositionsByLeId(
      (state.porfolioRespName?.portfolio_id as number) ||
        state.selectedExistingPortfolioId,
      leAccounts
    );
    dispatch({ type: "SET_IS_SELECT_ACCOUNT_OPEN", payload: false });
  };

  const cancelAccountsCallback = () => {
    dispatch({ type: "SET_IS_SELECT_ACCOUNT_OPEN", payload: false });
  };

  const addPosition = () => {
    dispatch({ type: "SET_MODE", payload: POSITION_MODES.ADD });
    dispatch({ type: "SET_IS_PORTFOLIO_EDIT_OPEN", payload: true });
  };

  const updatePositions = (gridData: gridResponseType[] | undefined) => {
    dispatch({ type: "SET_GRID_POSITIONS_DATA", payload: gridData });
    dispatch({ type: "SET_SELECTED_GRID_PORTFOLIO", payload: undefined });
  };

  const deletePositions = () => {
    if (state.selectedGridPortfolio) {
      dispatch({ type: "SET_IS_DISCARD_MODAL_OPEN", payload: true });
    }
  };

  const deletePosition = () => {
    const deletePortfolioRequestParams: deletePositionRequestType = {
      portfolio_id: state.selectedExistingPortfolioId,
      group_id: state.groupId,
      position_keys: state.selectedGridPortfolio?.map(
        (keys) => keys.position_key
      ),
    };
    deletePortfolioTrigger(deletePortfolioRequestParams)
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
          SnackBarUtils.success("Records deleted successfully", snackbarOption);
          dispatch({ type: "SET_GRID_POSITIONS_DATA", payload: d.data });
          dispatch({ type: "SET_IS_DISCARD_MODAL_OPEN", payload: false });
          dispatch({ type: "SET_SELECTED_GRID_PORTFOLIO", payload: undefined });
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

  const onPortfolioSave = (portfolio: portfolioSaveResponsetype) => {
    dispatch({
      type: "SET_SELECTED_EXISTING_PORTFOLIO_ID",
      payload: portfolio.portfolio_id,
    });
    dispatch({
      type: "SET_SELECTED_EXISTING_PORTFOLIO",
      payload: portfolio.portfolio_name,
    });
    dispatch({ type: "SET_GROUP_ID", payload: portfolio.group_id });
    dispatch({ type: "SET_GRID_POSITIONS_DATA", payload: portfolio.positions });
    sessionStorage.setItem("portfolioId", portfolio.portfolio_id.toString());
    sessionStorage.setItem("groupId", portfolio.group_id.toString());
    sessionStorage.setItem("jobStatus", portfolio.status);
    sessionStorage.setItem("portfolioName", portfolio.portfolio_name);
  };

  const gridReady = (api: GridApi) => {
    dispatch({
      type: "SET_GRID_API",
      payload: api,
    });
  };

  useEffect(() => {
    const sessionPortfolioId = sessionStorage.getItem("portfolioId");
    const sessionGroupId = sessionStorage.getItem("groupId");
    const sessionPortfolioName = sessionStorage.getItem("portfolioName");
    const sessionOptionValue = sessionStorage.getItem("optionValue");
    if (sessionPortfolioId && sessionPortfolioId?.length > 0) {
      const latestGridDataParams: discardPortfolioRequestType = {
        group_id: Number(sessionGroupId),
        portfolio_id: Number(sessionPortfolioId),
      };
      getLatestGridData(latestGridDataParams);
      dispatch({
        type: "SET_SELECTED_EXISTING_PORTFOLIO_ID",
        payload: Number(sessionPortfolioId),
      });
      dispatch({
        type: "SET_GROUP_ID",
        payload: Number(sessionGroupId),
      });

      dispatch({
        type: "SET_SELECTED_EXISTING_PORTFOLIO",
        payload: sessionPortfolioName as string,
      });

      dispatch({
        type: "SET_OPTION_VALUE",
        payload: Number(sessionOptionValue),
      });
    }
  }, []); // eslint-disable-line

  return (
    <div>
      <MuiTabs
        value={state.currentTabIndex}
        onChange={handleTabChange}
        className="tw-flex tw-justify-center"
        centered
      >
        <MuiTab label="Portfolio" className="tw-text-xs tw-normal-case" />
        <MuiTab label="Results" className="tw-text-xs tw-normal-case" />
      </MuiTabs>
      {state.currentTabIndex === 0 && (
        <div>
          <PortfolioControls
            portfolioId={state.selectedExistingPortfolioId}
            optionValue={state.optionValue}
            gridPositionsData={state.gridPositionsData}
            portfolioName={state.porfolioRespName}
            groupId={state.groupId}
            existingPortfolio={state.selectedExistingPortfolio}
            selectedPortfolio={state.selectedGridPortfolio}
            addNewPortfolioCallback={addNewPortfolio}
            onEditPortfolioCallback={editPortfolio}
            deletePositionsCallback={deletePositions}
            selectAccountsCallback={selectAccounts}
            ondeleteAccountsCallback={deletePosition}
            addPosition={addPosition}
            isPortfoliosSelected={state.selectedGridPortfolio}
            onPortfolioSave={onPortfolioSave}
            portfolioStatus={portfolioStatus}
            jobStatus={state.jobStatus}
          />
          <PortfolioDataTable
            portfolioData={state.gridPositionsData}
            portfolioName={state.selectedExistingPortfolio}
            gridPortfolioSelectionCallback={gridPortfolioSelection}
            isDataLoading={
              isPortfolioLoading ||
              isBatchPostionsLoading ||
              isAccountsPositionLoading
            }
            gridReady={gridReady}
          />
        </div>
      )}
      {state.currentTabIndex === 1 && (
        <Results
          portfolioId={state.selectedExistingPortfolioId}
          portfolioName={state.selectedExistingPortfolio}
        />
      )}
      <If condition={state.isDiscardModalOpen}>
        <DiscardPortflio
          isDiscardModalOpen={state.isDiscardModalOpen}
          onModalClose={modalClose}
          discardPortfolioCallback={discardPortfolio}
          selectedGridPortfolio={state.selectedGridPortfolio}
          deletePortfolio={deletePosition}
        />
      </If>
      <If condition={state.isSetupPortfolioOpen}>
        <PortfolioSetup
          isModalOpen={state.isSetupPortfolioOpen}
          onModalClose={modalClose}
          newPorfolioNameChange={newPorfolioNameChange}
          existingPortfolioList={state.existingPortfolioList}
          existingPortfolioSelection={existingPortfolioSelection}
          portfolioSaveCallback={portfolioSaveCallback}
          portfolioCancelCallback={portfolioCancelCallback}
          batchList={state.batchList}
        />
      </If>
      <If condition={state.isPortfolioEditOpen}>
        <PositionsEdit
          portfolioName={state.porfolioRespName}
          existingPortfolio={state.selectedExistingPortfolio}
          isModalOpen={state.isPortfolioEditOpen}
          onModalClose={modalClose}
          selectedPortfolio={state.selectedGridPortfolio}
          positionUpate={updatePositions}
          groupId={state.groupId}
          gridApi={state.gridApi}
          positionMode={state.mode}
        />
      </If>
      <If condition={state.isSelectAccountOpen}>
        <Accounts
          isModalOpen={state.isSelectAccountOpen}
          onModalClose={modalClose}
          saveAccountsCallback={saveAccountsCallback}
          cancelAccountsCallback={cancelAccountsCallback}
        />
      </If>
    </div>
  );
};
export default SyntheticPortfolio;
