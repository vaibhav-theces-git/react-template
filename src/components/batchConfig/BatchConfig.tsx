import { useEffect, useState, useCallback, useRef } from "react";
import MuiContainer from "src/common/components/container/MuiContainer";
import SnackBarUtils, {
  snackbarOption,
} from "src/common/components/SnackBarUtilsConfigurator";
import { errorPrefix } from "src/common/constants/testids";
import {
  useLazyGetBatchListDataQuery,
  useLazyGetDisabledBatchListDataQuery,
  useLazyRunAdhocBatchQuery,
} from "src/queries/batchListApi";
import { useLazyGetBatchVarLevelsDataQuery } from "src/queries/batchVarApi";
import { useLazyUpdateBatchConfigurationQuery } from "src/queries/batchConfigurationApi";
import { useLazyGetLegelEntityIdsAndNamesDataQuery } from "src/queries/legelEntityApi";
import {
  BatchListResponseType,
  BatchConfiguration,
  LegalEntity,
  BatchVarResponseType,
  LegelEntityIdsNamesResponseType,
  BatchRunRequestType,
  BatchDisableRequestType,
} from "src/types/batchConfigurationTypes";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { getErrorMessageFromError } from "src/common/utilities/globalUtils";
import { ErrorType } from "src/types/apiErrorTypes";
import { SelectChangeEvent } from "@mui/material";
import { useLazyDisableBatchConfigurationQuery } from "src/queries/disableBatchApi";
import { If } from "src/common/components/conditional";
import { MuiTab, MuiTabs } from "src/common/components/tab";
import ConfigurationTable from "./ConfigurationTable";
import BatchControls from "./BatchControls";
import BatchConfigEdit from "./BatchConfigEdit";
import { BatchEditModes } from "../../common/utilities/ValidationUtils/batchConfigConstants";
import BatchConfigClone from "./BatchConfigClone";
import AdHocScheduledBatchConfig from "./AdHocScheduledBatchConfig";

const BatchConfig = () => {
  const [initialRenderDone, setInititialRenderDone] = useState(false);
  const [batchTableData, setBatchTableData] = useState<BatchListResponseType[]>(
    []
  );
  const [batchActivationType, setBatchActivationType] =
    useState<string>("active batches");
  const [showBatchEditPopup, setShowBatchEditPopup] = useState<boolean>(false);
  const [showBatchClonePopup, setshowBatchClonePopup] =
    useState<boolean>(false);
  const [batchEditPopupMode, setBatchEditPopupMode] =
    useState<BatchEditModes>("new");
  const [selectedBatch, setSelectedBatch] = useState<BatchListResponseType>();
  const [legelEntityData, setLegelEntityData] = useState<LegalEntity[]>([]);
  const [batchVarConfigList, setBatchVarConfigList] = useState<
    BatchVarResponseType[]
  >([]);
  const [legalEntityIdNames, setLegalEntityIdNames] = useState<
    LegelEntityIdsNamesResponseType[]
  >([]);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const batchConfigRef = useRef<any>(null);
  const ConfigTableRef = useRef<any>(null);
  const [batchListTrigger] = useLazyGetBatchListDataQuery();
  const [disabledBatchListTrigger] = useLazyGetDisabledBatchListDataQuery();
  const [batchVarTypeTrigger] = useLazyGetBatchVarLevelsDataQuery();
  const [batchConfigTrigger] = useLazyUpdateBatchConfigurationQuery();
  const [disableBatchTrigger] = useLazyDisableBatchConfigurationQuery();
  const [legelEntityIdNameTrigger] =
    useLazyGetLegelEntityIdsAndNamesDataQuery();
  const [runBatchTrigger] = useLazyRunAdhocBatchQuery();

  const getBatchList = useCallback(() => {
    batchListTrigger(false)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: BatchListResponseType[] | undefined;
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
          setBatchTableData(d.data as BatchListResponseType[]);
        } else {
          setBatchTableData([]);
          const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
          SnackBarUtils.error(errorMsg, snackbarOption);
        }
      })
      .catch((e) => {
        const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
        SnackBarUtils.error(errorMsg, snackbarOption);
      });
  }, [batchListTrigger]);
  const getDisabledBatchList = useCallback(() => {
    disabledBatchListTrigger()
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: BatchListResponseType[] | undefined;
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
          setBatchTableData(d.data as BatchListResponseType[]);
        } else {
          setBatchTableData([]);
          const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
          SnackBarUtils.error(errorMsg, snackbarOption);
        }
      })
      .catch((e) => {
        const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
        SnackBarUtils.error(errorMsg, snackbarOption);
      });
  }, [disabledBatchListTrigger]);

  const getLegelEntityIdAndNameList = useCallback(() => {
    legelEntityIdNameTrigger()
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: LegelEntityIdsNamesResponseType[] | undefined;
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
          setLegalEntityIdNames(d.data as LegelEntityIdsNamesResponseType[]);
        } else {
          setLegalEntityIdNames([]);
          const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
          SnackBarUtils.error(errorMsg, snackbarOption);
        }
      })
      .catch((e) => {
        const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
        SnackBarUtils.error(errorMsg, snackbarOption);
      });
  }, [legelEntityIdNameTrigger]);

  const getBatchVarLevels = useCallback(() => {
    batchVarTypeTrigger()
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: BatchVarResponseType[] | undefined;
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
          setBatchVarConfigList(d.data as BatchVarResponseType[]);
        } else {
          setBatchVarConfigList([]);
          const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
          SnackBarUtils.error(errorMsg, snackbarOption);
        }
      })
      .catch((e) => {
        const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
        SnackBarUtils.error(errorMsg, snackbarOption);
      });
  }, [batchVarTypeTrigger]);

  const onBatchConfigRowSelection = (row: BatchListResponseType) => {
    const legelEntities: LegalEntity[] = row.portfolio_details.portfolio.map(
      (entity) => {
        const fentity = legalEntityIdNames.find(
          (le) => le.le_id === entity.le_id
        );
        return {
          le_id: entity.le_id,
          name: fentity ? fentity?.name : "",
          excluded_accts: entity.excluded_accts,
        };
      }
    );
    setSelectedBatch(row);
    setLegelEntityData(legelEntities);
  };
  const batchActivationTypeChange = (event: SelectChangeEvent<unknown>) => {
    const activationType = event.target.value as string;
    setBatchActivationType(activationType);
    if (activationType.toLowerCase() === "active batches") {
      getBatchList();
      ConfigTableRef?.current?.resetPagination(); // eslint-disable-line
    } else {
      setSelectedBatch(undefined);
      getDisabledBatchList();
      // eslint-disable-next-line
      batchConfigRef?.current?.config();
      ConfigTableRef?.current?.resetPagination(); // eslint-disable-line
    }
  };
  const onAddBatchClick = () => {
    setSelectedBatch(undefined);
    setLegelEntityData([]);
    setBatchEditPopupMode("new");
    setShowBatchEditPopup(true);
  };

  const onEditBatchClick = () => {
    if (selectedBatch) {
      setBatchEditPopupMode("edit");
      setShowBatchEditPopup(true);
    } else {
      SnackBarUtils.warning("Please select a batch!", snackbarOption);
    }
  };
  const onDisableBatchClick = () => {
    if (selectedBatch) {
      if (selectedBatch.is_critical === true) {
        SnackBarUtils.warning(
          `Critical Batch : Un-check "Critical Batch" flag`,
          snackbarOption
        );
      } else {
        const batchIdList: number = selectedBatch?.batch_id;
        const runBatchIdList: number = selectedBatch?.run_batch_id;

        const batchData: BatchDisableRequestType = {
          batch_id: batchIdList,
          audit_batch_id: runBatchIdList,
          is_disabled: true,
        };
        disableBatchTrigger(batchData)
          .then((resp) => {
            const respData: {
              status: QueryStatus;
              data: string | undefined;
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
              SnackBarUtils.success(
                d.data ? "Batch disabled Successfully" : "",
                snackbarOption
              );
              getBatchList();
              setSelectedBatch(undefined);
            } else {
              const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
              SnackBarUtils.error(errorMsg, snackbarOption);
            }
          })
          .catch((e) => {
            const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
            SnackBarUtils.error(errorMsg, snackbarOption);
          });
      }
    } else {
      SnackBarUtils.warning("Please select a batch!", snackbarOption);
    }
  };
  const onEnableBatchClick = () => {
    if (selectedBatch) {
      const batchIdList: number = selectedBatch?.batch_id;
      const runBatchIdList: number = selectedBatch?.run_batch_id;

      const batchData: BatchDisableRequestType = {
        batch_id: batchIdList,
        audit_batch_id: runBatchIdList,
        is_disabled: false,
      };
      disableBatchTrigger(batchData)
        .then((resp) => {
          const respData: {
            status: QueryStatus;
            data: string | undefined;
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
            SnackBarUtils.success(
              d.data ? "Batch Enabled Successfully" : "",
              snackbarOption
            );
            getDisabledBatchList();
            setSelectedBatch(undefined);
          } else {
            const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
            SnackBarUtils.error(errorMsg, snackbarOption);
          }
        })
        .catch((e) => {
          const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
          SnackBarUtils.error(errorMsg, snackbarOption);
        });
    } else {
      SnackBarUtils.warning("Please select a batch!", snackbarOption);
    }
    setSelectedBatch(undefined);
  };
  const onCloneBatchClick = () => {
    if (selectedBatch) {
      setBatchEditPopupMode("clone");
      setshowBatchClonePopup(true);
    } else {
      SnackBarUtils.warning("Please select a batch!", snackbarOption);
    }
  };

  const onRunBatchClick = () => {
    if (selectedBatch) {
      const batchIdList: number[] = selectedBatch
        ? [selectedBatch?.batch_id]
        : [];
      const runBatchIdList: number[] = selectedBatch
        ? [selectedBatch?.run_batch_id]
        : [];

      const batchIds: BatchRunRequestType = {
        batch_ids: batchIdList,
        run_batch_id: runBatchIdList,
      };

      runBatchTrigger(batchIds)
        .then((resp) => {
          const respData: {
            status: QueryStatus;
            data: void | undefined;
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
            SnackBarUtils.success(
              d.data ? "Request submitted successfully" : "",
              snackbarOption
            );
            getBatchList();
            setSelectedBatch(undefined);
          } else {
            const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
            SnackBarUtils.error(errorMsg, snackbarOption);
          }
        })
        .catch((e) => {
          const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
          SnackBarUtils.error(errorMsg, snackbarOption);
        });
    } else {
      SnackBarUtils.warning("Please select a batch!", snackbarOption);
    }
  };

  const onCloseBatchPopup = () => {
    setSelectedBatch(undefined);
    setShowBatchEditPopup(false);
    setshowBatchClonePopup(false);
  };
  const onBatchSave = (batch: BatchConfiguration) => {
    batchConfigTrigger(batch)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: BatchConfiguration | undefined;
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
          getBatchList();
          setSelectedBatch(undefined);
          SnackBarUtils.success("Batch saved successfully ", snackbarOption);
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
  const handleTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    tabIndex: React.SetStateAction<number>
  ) => {
    setCurrentTabIndex(tabIndex);
    setSelectedBatch(undefined);
  };

  useEffect(() => {
    getLegelEntityIdAndNameList();
    if (!initialRenderDone) {
      getBatchList();
      setInititialRenderDone(true);
      getBatchVarLevels();
    }
  }, [
    initialRenderDone,
    getBatchList,
    getBatchVarLevels,
    getLegelEntityIdAndNameList,
  ]);

  return (
    <div className="tw-h-full">
      <MuiTabs
        value={currentTabIndex}
        onChange={handleTabChange}
        className="tw-flex tw-justify-center"
        centered
      >
        <MuiTab
          label="Batch Configuration"
          className="tw-text-xs tw-normal-case"
        />
        <MuiTab label="Ad-Hoc Runs" className="tw-text-xs tw-normal-case" />
        <MuiTab label="Scheduled Runs" className="tw-text-xs tw-normal-case" />
      </MuiTabs>
      {currentTabIndex === 0 && (
        <div>
          <BatchControls
            batchTypeChange={batchActivationTypeChange}
            selectedbatchType={batchActivationType}
            selectedBatch={selectedBatch as BatchListResponseType}
            onAddClick={onAddBatchClick}
            onEditClick={onEditBatchClick}
            onDisableClick={onDisableBatchClick}
            onCloneClick={onCloneBatchClick}
            onRunClick={onRunBatchClick}
            onRefreshClick={
              batchActivationType.toLowerCase() === "active batches"
                ? getBatchList
                : getDisabledBatchList
            }
            onEnableClick={onEnableBatchClick}
          />
          <MuiContainer className="tw-w-fit tw-min-w-full tw-p-0 tw-h-full">
            <ConfigurationTable
              data={batchTableData}
              onBatchConfigRowSelection={onBatchConfigRowSelection}
              ref={ConfigTableRef}
            />
          </MuiContainer>
          <If condition={showBatchEditPopup}>
            <BatchConfigEdit
              isOpen={showBatchEditPopup}
              mode={batchEditPopupMode}
              batch={selectedBatch as BatchListResponseType}
              legelEntityData={legelEntityData}
              legelEntityIdNames={legalEntityIdNames}
              batchVarConfigList={batchVarConfigList}
              batchConfigurationSaveCallback={onBatchSave}
              batchConfigurationCloseCallback={onCloseBatchPopup}
            />
          </If>
          <If condition={showBatchClonePopup}>
            <BatchConfigClone
              isOpen={showBatchClonePopup}
              mode={batchEditPopupMode}
              batch={selectedBatch as BatchListResponseType}
              legelEntityData={legelEntityData}
              legelEntityIdNames={legalEntityIdNames}
              batchVarConfigList={batchVarConfigList}
              batchCloneConfigurationSaveCallback={onBatchSave}
              batchConfigurationCloseCallback={onCloseBatchPopup}
            />
          </If>
        </div>
      )}
      {currentTabIndex === 1 && (
        <AdHocScheduledBatchConfig currentTabIndex={currentTabIndex} />
      )}
      {currentTabIndex === 2 && (
        <AdHocScheduledBatchConfig currentTabIndex={currentTabIndex} />
      )}
    </div>
  );
};

export default BatchConfig;
