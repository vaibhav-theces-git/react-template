import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Radio, SelectChangeEvent } from "@mui/material";
import { MuiBox } from "src/common/components/box/MuiBox";
import { CustomModal } from "src/common/components/modal/MuiModal/CustomModal";
import { MuiCheckbox } from "src/common/components/checkbox/MuiCheckbox";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import { MuiTextField } from "src/common/components/input/MuiInputs";
import { MuiButton } from "src/common/components/button/MuiButtons/MuiButton";
import dayjs, { Dayjs } from "dayjs";
import MuiTooltip from "src/common/components/tooltip/MuiTooltip";
import { MuiStack } from "src/common/components/stack/MuiStack";
import {
  BatchAggregationResponseType,
  BatchRunMeasure,
  BatchConfiguration,
  BatchVarResponseType,
  LegalEntity,
  LegelEntityIdsNamesResponseType,
  LegelEntityAccountType,
  LegalEntityPostType,
  BatchListResponseType,
  ScenarioMetrics,
  ScenarioGrid,
} from "src/types/batchConfigurationTypes";
import { getYYYYMMDDFormattedDateString } from "src/common/utilities/formatUtils/dateUtils";
import { useLazyGetLegelEntityAccountsByIdDataQuery } from "src/queries/legelEntityApi";
import { errorPrefix } from "src/common/constants/testids";
import SnackBarUtils, {
  snackbarOption,
} from "src/common/components/SnackBarUtilsConfigurator";
import {
  getRunDaysToSave,
  setRunDaysArrayFromString,
  validateEmptyBatchName,
  validateHierarchies,
  validateHoldingPeriod,
  validatePeriod,
  validatePortifolioList,
  validateSchedule,
  validateSpotVolGridData,
  validateStartEndDatePeriod,
} from "src/common/utilities/ValidationUtils/ValidationUtils";
import { entitySelectionTextBoxStyle } from "src/common/utilities/styleUtils/batchConfigStyles";
import {
  spotVolGridCRequestConversion,
  spotVolGridResponseConversion,
} from "src/common/utilities/formatUtils/SpotVolaDataConversion";
import { batchValidationRequestType } from "src/types/validationTypes";
import { QueryStatus } from "@reduxjs/toolkit/dist/query/react";
import { getErrorMessageFromError } from "src/common/utilities/globalUtils";
import { ErrorType } from "src/types/apiErrorTypes";
import { useLazyBatchValidationQuery } from "src/queries/batchValidationApi";
import {
  MuiFormControl,
  MuiFormControlLabel,
} from "src/common/components/form/MuiForms";
import { MuiRadioGroup } from "src/common/components/radio/MuiRadioGroup";
import cloneDeep from "lodash/cloneDeep";
import { checkboxStyles } from "src/common/utilities/styleUtils/CheckboxStyle";
import { BATCH_TYPES } from "src/common/constants/batchTypeConstant";
import {
  BatchEditModes,
  varLevels,
  pattern,
} from "../../common/utilities/ValidationUtils/batchConfigConstants";
import PortfolioConfig from "./PortfolioConfig";
import AggregateConfig from "./AggregateConfig";
import EntitySelection from "./EntitySelection";
import AccountSelection from "./AccountSelection";
import ScheduleSelection from "./ScheduleSelection";
import VarBackTestSelection from "./VarBackTestSelection";
import PeriodCustomSelection from "./PeriodCustomeSelection";
import ScenarioAnalysis from "./ScenarioAnalysis";
import { matrixData, spotVoldata } from "./secenarioData";

export interface BatchConfigEditProps {
  isOpen: boolean;
  mode: BatchEditModes;
  batch: BatchListResponseType;
  legelEntityData: LegalEntity[];
  legelEntityIdNames: LegelEntityIdsNamesResponseType[];
  batchVarConfigList: BatchVarResponseType[];
  batchConfigurationSaveCallback: (batch: BatchConfiguration) => void;
  batchConfigurationCloseCallback: () => void;
}

const BatchConfigEdit: React.FC<BatchConfigEditProps> = (
  props: BatchConfigEditProps
) => {
  const {
    isOpen,
    mode,
    batch,
    legelEntityData,
    legelEntityIdNames,
    batchVarConfigList,
    batchConfigurationSaveCallback,
    batchConfigurationCloseCallback,
  } = props;
  const [popupTitle, setPopupTitle] = useState("");
  const [batchId, setBatchId] = useState<number>(0);
  const [batchName, setBatchName] = useState("");
  const [isCriticalBatch, setIsCriticalBatch] = useState<boolean>(false);
  const [aggregationHierarchyList, setAggregationHierarchyList] = useState<
    BatchAggregationResponseType[]
  >(batch && batch.agg_heirarchy_types ? batch.agg_heirarchy_types : []);
  const [varConfigurationList, setVarConfigurationList] =
    useState<BatchVarResponseType[]>(batchVarConfigList);
  const [isVarBackTestBatch, setisVarBackTestBatch] = useState(false);
  const [selectedBatchType, setSelectedBatchType] = useState(
    BATCH_TYPES.REGULAR
  );
  const [isValidVarBackTestPeriod, setIsValidVarBackTestPeriod] =
    useState(true);
  const [varBackTestStartDate, setVarBackTestStartDate] =
    useState<Dayjs | null>(dayjs(""));
  const [varBackTestEndDate, setVarBackTestEndDate] = useState<Dayjs | null>(
    dayjs("")
  );
  const [selectedMatrix, setSelectedMatrix] =
    useState<ScenarioMetrics[]>(matrixData);
  const [selectedSpotVolGrid, setSelectedSpotVolGrid] =
    useState<ScenarioGrid[]>(spotVoldata);
  const [isScheduledBatch, setIsScheduledBatch] = useState<boolean>(false);
  const [isCustomPeriodSelected, setIsCustomPeriodSelected] = useState(false);
  const [periodValue, setPeriodValue] = useState<string>("");
  const [periodMeasure, setPeriodMeasure] = useState("Months");
  const [holdingPeriodValue, setholdingPeriodValue] = useState<string>("");
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs(""));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs(""));
  const [legelEntityTableData, setLegelEntityTableData] =
    useState<LegalEntity[]>(legelEntityData);
  const [isOpenEntitySelection, setIsOpenEntitySelection] =
    useState<boolean>(false);
  const [legelEntityIdAndNameList, setLegelEntityIdAndNameList] =
    useState<LegelEntityIdsNamesResponseType[]>(legelEntityIdNames);
  const [selectedEntityList, setSelectedEntityList] = useState<
    LegelEntityIdsNamesResponseType[]
  >([]);
  const [selectedEntity, setSelectedEntity] = useState<LegalEntity>();
  const [isOpenAccountSelection, setIsOpenAccountSelection] =
    useState<boolean>(false);
  const [accountList, setAccountList] = useState<LegelEntityAccountType[]>([]);
  const [selectedAccountList, setSelectedAccountList] = useState<
    LegelEntityAccountType[]
  >([]);
  const [excludedAccountList, setExcludedAccountList] = useState<
    LegelEntityAccountType[]
  >([]);
  const [scheduleTimeValue, setScheduleTimeValue] = useState(dayjs());
  const [scheduleTimeString, setScheduleTimeString] = useState("");
  const [selectedRunDays, setSelectedRunDays] = useState<BatchRunMeasure[]>([]);
  const [initialRenderDone, setInitialRenderDone] = useState<boolean>(false);
  const [isBatchNameValid, setIsBatchNameValid] = useState<boolean>(true);
  const [isPeriodValid, setIsPeriodValid] = useState<boolean>(true);
  const [isHoldingPeriodValid, setIsHoldingPeriodValid] =
    useState<boolean>(true);
  const [isValidCustomPeriod, setIsValidCustomPeriod] = useState<boolean>(true);
  const [isScheduleValid, setIsScheduleValid] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [isSpotVolGridValid, setIsSpotVolGridValid] = useState(false); // eslint-disable-line

  const filteredEntityData = legelEntityIdAndNameList?.filter((item) =>
    item?.name?.toLowerCase().includes(searchTerm?.toLowerCase())
  );
  const filteredAccData = accountList?.filter((item) =>
    item?.name?.toLowerCase().includes(searchTerm?.toLowerCase())
  );
  const [accountsTrigger] = useLazyGetLegelEntityAccountsByIdDataQuery();
  const getLegelEntityAccountsById = useCallback(
    (entity: LegalEntity) => {
      accountsTrigger(entity.le_id)
        .then((resp) => {
          if (resp.status === "fulfilled" && resp.data.length > 0) {
            const leObject = resp.data[0];
            setAccountList(leObject.account_ids);
            const accList = leObject.account_ids.map((acc) => acc);
            const selectedAccs = accList.filter((acc) => {
              return !entity.excluded_accts.some(
                (exac) => acc.acc_id === exac.acc_id
              );
            });
            setSelectedAccountList(selectedAccs);
            setExcludedAccountList(entity.excluded_accts);
          } else {
            setAccountList([]);
            setSelectedAccountList([]);
            setExcludedAccountList([]);
            const errorMsg = `${errorPrefix} Technical Error : ${
              resp.error ? (resp.error as string) : ""
            }`;
            SnackBarUtils.error(errorMsg, snackbarOption);
          }
        })
        .catch((e) => {
          setAccountList([]);
          setSelectedAccountList([]);
          setExcludedAccountList([]);
          const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
          SnackBarUtils.error(errorMsg, snackbarOption);
        });
    },
    [accountsTrigger]
  );
  const handlePeriodCheckBoxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsCustomPeriodSelected(!event.target.checked);
  };
  const handleCustomPeriodCheckBoxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsCustomPeriodSelected(event.target.checked);
  };
  const handlePeriodValueChange = (event: { target: { value: string } }) => {
    setIsPeriodValid(
      validatePeriod(event.target.value, isCustomPeriodSelected, periodMeasure)
    );
    setPeriodValue(event.target.value);
  };
  const handleholdingPeriodValueChange = (event: {
    target: { value: string };
  }) => {
    setIsHoldingPeriodValid(validateHoldingPeriod(event.target.value));
    setholdingPeriodValue(event.target.value);
  };
  const handlePeriodMeasureChange = (event: SelectChangeEvent<unknown>) => {
    setIsPeriodValid(
      validatePeriod(
        periodValue,
        isCustomPeriodSelected,
        event.target.value as string
      )
    );
    setPeriodMeasure(event.target.value as string);
  };
  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    setStartDate(date);
    setIsValidCustomPeriod(
      validateStartEndDatePeriod(date, endDate, isCustomPeriodSelected)
    );
  };
  const handleEndDateChange = (date: dayjs.Dayjs | null) => {
    setEndDate(date);
    setIsValidCustomPeriod(
      validateStartEndDatePeriod(startDate, date, isCustomPeriodSelected)
    );
  };
  const handleVarBackTestStartDateChange = (date: dayjs.Dayjs | null) => {
    setVarBackTestStartDate(date);
    setIsValidVarBackTestPeriod(
      validateStartEndDatePeriod(date, varBackTestEndDate, isVarBackTestBatch)
    );
  };
  const handleVarBackTestEndDateChange = (date: dayjs.Dayjs | null) => {
    setVarBackTestEndDate(date);
    setIsValidVarBackTestPeriod(
      validateStartEndDatePeriod(varBackTestStartDate, date, isVarBackTestBatch)
    );
  };

  const handleScheduleCheckboxValueChange = (event: {
    target: { checked: boolean };
  }) => {
    setIsScheduledBatch(event.target.checked);
  };
  const [batchValidationDataTrigger] = useLazyBatchValidationQuery();

  const validateBatchNames = useCallback(
    (bName: string) => {
      if (bName && bName.trim() !== "" && !pattern.test(bName)) {
        const batchvalidationParams: batchValidationRequestType = {
          batch_name: bName,
        };
        batchValidationDataTrigger(batchvalidationParams)
          .then((resp) => {
            const respData: {
              status: QueryStatus;
              data: boolean | undefined;
              error: string;
            } = {
              status: resp.status,
              data: resp?.data,
              error: getErrorMessageFromError(resp.error as ErrorType),
            };
            return respData;
          })
          .then((d) => {
            if (d.status === "fulfilled" && d.data === true) {
              setIsBatchNameValid(false);
            } else {
              setIsBatchNameValid(true);
            }
          })
          .catch((e) => {
            const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
            SnackBarUtils.error(errorMsg, snackbarOption);
          });
      } else {
        setIsBatchNameValid(false);
      }
    },

    [batchValidationDataTrigger]
  );

  const handleBatchNameChange = (event: { target: { value: string } }) => {
    const batchNameToBeValidate = event.target.value;
    validateBatchNames(batchNameToBeValidate);
    setBatchName(event.target.value);
  };
  const handleCriticalBatchValueChange = (event: {
    target: { checked: boolean };
  }) => {
    setIsCriticalBatch(event.target.checked);
  };
  const onAddNewHierarchy = (newHierarchy: BatchAggregationResponseType) => {
    setAggregationHierarchyList([...aggregationHierarchyList, newHierarchy]);
  };
  const onDeleteHierarchy = (hierarchy: BatchAggregationResponseType) => {
    const aggList = [...aggregationHierarchyList];
    const index = aggregationHierarchyList.indexOf(hierarchy);
    aggList.splice(index, 1);
    setAggregationHierarchyList(aggList);
  };
  const onAddNewVarConfig = (newVarConfig: BatchVarResponseType) => {
    setVarConfigurationList([...varConfigurationList, newVarConfig]);
  };
  const populateSelectedEntities = useCallback(() => {
    if (legelEntityTableData && legelEntityTableData.length > 0) {
      setSelectedEntityList(
        legelEntityTableData.map((item) => {
          const sEntity: LegelEntityIdsNamesResponseType = {
            le_id: item?.le_id,
            name: item?.name,
          };
          return sEntity;
        })
      );
    }
  }, [legelEntityTableData]);
  const onAddEntity = () => {
    populateSelectedEntities();
    setIsOpenEntitySelection(true);
  };
  const onDeleteEntity = () => {
    if (legelEntityTableData.some((e) => e.le_id === selectedEntity?.le_id)) {
      const leList = legelEntityTableData.filter(
        (e) => e.le_id !== selectedEntity?.le_id
      );
      const newSelectedEntityList = [...selectedEntityList];
      const updatedList = newSelectedEntityList.findIndex(
        (x) => x.le_id === selectedEntity?.le_id
      );
      if (updatedList >= 0) {
        newSelectedEntityList.splice(updatedList, 1);
      }
      setSelectedEntityList(newSelectedEntityList);
      setLegelEntityTableData(leList);
      setSelectedEntity(undefined);
    }
  };
  const handleSearchTerm = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchTerm(event?.target.value);
  };
  const handleSelectAllValueChange = (event: {
    target: { checked: boolean };
  }) => {
    setIsSelectAllChecked(event.target.checked);
    if (event.target.checked) {
      setSelectedEntityList(legelEntityIdAndNameList);
    } else {
      setSelectedEntityList([]);
    }
  };
  const handleToggleEntitySelection =
    (value: LegelEntityIdsNamesResponseType) => () => {
      const currentIndex = selectedEntityList.findIndex(
        (x) => x.le_id === value.le_id
      );
      const newChecked = [...selectedEntityList];
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
        setIsSelectAllChecked(false);
      }
      setSelectedEntityList(newChecked);
      if (
        legelEntityIdAndNameList?.length > 0 &&
        legelEntityIdAndNameList?.length === newChecked?.length
      ) {
        setIsSelectAllChecked(true);
      }
    };
  const handleEntitySelectionClose = () => {
    setIsOpenEntitySelection(false);
    setSearchTerm("");
  };
  const handleEntitySelectionSave = () => {
    const tempLegelEntityTableData: LegalEntity[] = [];
    selectedEntityList.map((entity) => {
      const entityExists = legelEntityTableData.some(
        (e) => e.le_id === entity.le_id
      );
      const le: LegalEntity = {
        le_id: entity.le_id,
        name: entity.name,
        excluded_accts: [],
      };
      if (!entityExists) {
        tempLegelEntityTableData.push(le);
      } else {
        tempLegelEntityTableData.push(
          legelEntityTableData.find(
            (x) => x.le_id === entity.le_id
          ) as LegalEntity
        );
      }
      return entity;
    });
    setLegelEntityTableData(tempLegelEntityTableData);
    handleEntitySelectionClose();
  };
  const onLegelEntityRowSelection = (row: LegalEntity) => {
    setSelectedEntity(row);
  };
  const onEditEntityAccounts = (data: LegalEntity) => {
    setSelectedEntity(data);
    getLegelEntityAccountsById(data);
    setExcludedAccountList(data.excluded_accts);
    setIsOpenAccountSelection(true);
  };
  const handleAccountSelectionClose = () => {
    setIsOpenAccountSelection(false);
    setSearchTerm("");
  };
  const handleToggleAccountSelection =
    (value: LegelEntityAccountType) => () => {
      const currentIndex = selectedAccountList.indexOf(value);
      const newChecked = [...selectedAccountList];
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      setSelectedAccountList(newChecked);
      const exAccs = accountList
        .filter((val) => newChecked.indexOf(val) === -1)
        .map((acc) => acc);
      setExcludedAccountList(exAccs);
    };
  const handleAccountSelectionSave = () => {
    const leList = [...legelEntityTableData];
    const le: LegalEntity = {
      le_id: selectedEntity?.le_id as string,
      name: selectedEntity?.name as string,
      excluded_accts: excludedAccountList,
    };
    const entityExists = legelEntityTableData.some((e) => e.le_id === le.le_id);
    if (entityExists) {
      const currEntity = legelEntityTableData.find((e) => e.le_id === le.le_id);
      leList.splice(leList.indexOf(currEntity as LegalEntity), 1);
    }
    leList.push(le);
    setLegelEntityTableData(leList);
    handleAccountSelectionClose();
  };
  const handleScheduleTimeValueChange = (e: Dayjs) => {
    setScheduleTimeValue(e);
    const timeString = e
      .hour()
      .toString()
      .concat(":")
      .concat(e.minute().toString());
    setScheduleTimeString(timeString);
    setIsScheduleValid(
      validateSchedule(timeString, selectedRunDays, isScheduledBatch)
    );
  };
  const hanndleRunDayTypeCheck = (value: BatchRunMeasure) => {
    const currentIndex = selectedRunDays.indexOf(value);
    const rundays = [...selectedRunDays];
    if (currentIndex === -1) {
      rundays.push(value);
    } else {
      rundays.splice(currentIndex, 1);
    }
    setSelectedRunDays(rundays);
    setIsScheduleValid(
      validateSchedule(scheduleTimeString, rundays, isScheduledBatch)
    );
  };
  const setScheduleTimeFromString = (time: string) => {
    const sdate = new Date("1970-01-01".concat(" ").concat(time));
    setScheduleTimeValue(dayjs(sdate));
    setScheduleTimeString(time);
  };
  const handleMatrixChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const propertyName = event.target.name as keyof ScenarioMetrics;
    const updatedMatrix = selectedMatrix.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          [propertyName]: event.target.checked as any,
        };
      }
      return item;
    });
    setSelectedMatrix(updatedMatrix);
  };
  const handleSpotVolGridValueChange = (data: ScenarioGrid[]) => {
    setSelectedSpotVolGrid(data);
  };
  const handleBatchTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === BATCH_TYPES.REGULAR) {
      setSelectedBatchType(event.target.value);
      setAggregationHierarchyList([]);
      setisVarBackTestBatch(false);
    } else if (event.target.value === BATCH_TYPES.VBT) {
      setSelectedBatchType(event.target.value);
      setisVarBackTestBatch(true);
      setAggregationHierarchyList([]);
      setStartDate(dayjs(""));
      setEndDate(dayjs(""));
      setScheduleTimeValue(dayjs());
      setScheduleTimeString("");
      setScheduleTimeFromString("00:00");
      setSelectedRunDays([]);
      setIsCustomPeriodSelected(false);
      setIsScheduledBatch(false);
    } else if (event.target.value === BATCH_TYPES.SPOT_VOL) {
      setSelectedBatchType(event.target.value);
      setAggregationHierarchyList([]);
      setSelectedSpotVolGrid(spotVoldata);
      setSelectedMatrix(matrixData);
      setisVarBackTestBatch(false);
    } else if (event.target.value === BATCH_TYPES.UNIT_VAR) {
      setSelectedBatchType(event.target.value);
      setAggregationHierarchyList([]);
      setLegelEntityTableData([]);
      setSelectedEntityList([]);
      setisVarBackTestBatch(false);
    }
  };
  const handleBatchConfigurationClose = () => {
    batchConfigurationCloseCallback();
    setInitialRenderDone(false);
  };

  const onSave = () => {
    if (!validateEmptyBatchName(batchName)) {
      const validPeriod = validatePeriod(
        periodValue,
        isCustomPeriodSelected,
        periodMeasure
      );
      setIsValidCustomPeriod(validPeriod);
      const validSchedule = validateSchedule(
        scheduleTimeString,
        selectedRunDays,
        isScheduledBatch
      );
      setIsScheduleValid(validSchedule);
      if (batchId && batchId !== 0) {
        setIsBatchNameValid(true);
      } else {
        validateBatchNames(batchName);
      }
      const validPortfolioList = validatePortifolioList(
        legelEntityTableData,
        selectedBatchType
      );
      const validHierarchyList =
        isVarBackTestBatch || selectedBatchType === BATCH_TYPES.SPOT_VOL
          ? true
          : validateHierarchies(aggregationHierarchyList);
      const validCustomPeriod = validateStartEndDatePeriod(
        startDate,
        endDate,
        isCustomPeriodSelected
      );
      setIsValidCustomPeriod(validCustomPeriod);
      const validVarBackTestPeriod = validateStartEndDatePeriod(
        varBackTestStartDate,
        varBackTestEndDate,
        isVarBackTestBatch
      );
      setIsValidVarBackTestPeriod(validVarBackTestPeriod);
      const validHoldingPeriod = validateHoldingPeriod(holdingPeriodValue);
      setIsHoldingPeriodValid(validHoldingPeriod);
      const validSpotVolGrid = validateSpotVolGridData(selectedSpotVolGrid);
      setIsSpotVolGridValid(validSpotVolGrid);
      if (
        isBatchNameValid &&
        validPortfolioList &&
        (isVarBackTestBatch || selectedBatchType === BATCH_TYPES.SPOT_VOL
          ? true
          : validHierarchyList) &&
        validPeriod &&
        validCustomPeriod &&
        validVarBackTestPeriod &&
        validHoldingPeriod &&
        validSchedule &&
        validSpotVolGrid
      ) {
        const leAccounts: LegalEntityPostType[] = legelEntityTableData.map(
          (entity) => ({
            le_id: entity.le_id,
            excluded_accts: entity.excluded_accts,
          })
        );
        const rundays = getRunDaysToSave(selectedRunDays);
        const batchConfigToSave: BatchConfiguration = {
          batch_id: batchId,
          batch_name: batchName,
          is_critical: isCriticalBatch,
          batch_type: selectedBatchType,
          le_accounts: leAccounts,
          agg_heirarchy: aggregationHierarchyList,
          var_levels: varConfigurationList,
          period_no: Number(periodValue),
          period_type: periodMeasure,
          period_start_date: isCustomPeriodSelected
            ? getYYYYMMDDFormattedDateString(startDate as Dayjs)
            : "",
          period_end_date: isCustomPeriodSelected
            ? getYYYYMMDDFormattedDateString(endDate as Dayjs)
            : "",
          var_gapping: Number(holdingPeriodValue),
          vbt_flag: isVarBackTestBatch,
          vbt_start_date: isVarBackTestBatch
            ? getYYYYMMDDFormattedDateString(varBackTestStartDate as Dayjs)
            : "",
          vbt_end_date: isVarBackTestBatch
            ? getYYYYMMDDFormattedDateString(varBackTestEndDate as Dayjs)
            : "",
          spotvol_scenarios:
            selectedBatchType === BATCH_TYPES.SPOT_VOL
              ? {
                  spot_grid: spotVolGridCRequestConversion(
                    selectedSpotVolGrid,
                    "spot"
                  ),
                  vol_grid: spotVolGridCRequestConversion(
                    selectedSpotVolGrid,
                    "vol"
                  ),
                  scenario_metrics: selectedMatrix,
                }
              : null,
          request_type: isScheduledBatch ? "Scheduled" : "Adhoc",
          scheduled_flag: isScheduledBatch,
          scheduled_start_time: scheduleTimeString,
          scheduled_run_days: rundays,
        };
        batchConfigurationSaveCallback(batchConfigToSave);
        handleBatchConfigurationClose();
      }
    } else {
      SnackBarUtils.error("Batch Name cannot be Empty", snackbarOption);
    }
  };
  useEffect(() => {
    if (mode === "edit" && batch) {
      setPopupTitle("Edit");
      setBatchId(batch.batch_id);
      setBatchName(batch.batch_name);
      setSelectedBatchType(batch.batch_type);
      setIsCriticalBatch(batch.is_critical);
      setLegelEntityIdAndNameList(legelEntityIdNames);
      setAggregationHierarchyList(batch.agg_heirarchy_types);
      setVarConfigurationList(varLevels);
      setIsScheduledBatch(batch.schedule_flag);
      setScheduleTimeFromString(
        batch.scheduled_start_time ? batch.scheduled_start_time : "00:00"
      );
      setSelectedMatrix(
        batch?.spotvol_scenarios?.scenario_metrics as ScenarioMetrics[]
      );
      setSelectedSpotVolGrid(
        cloneDeep(spotVolGridResponseConversion(batch?.spotvol_scenarios))
      );
      setPeriodValue(batch.period_no.toString());
      setPeriodMeasure(batch.period_type.toLowerCase());
      if (batch.period_start_date && batch.period_end_date) {
        setIsCustomPeriodSelected(true);
        setStartDate(dayjs(new Date(batch.period_start_date)));
        setEndDate(dayjs(new Date(batch.period_end_date)));
      }
      if (batch.vbt_start_date && batch.vbt_end_date) {
        setisVarBackTestBatch(true);
        setVarBackTestStartDate(dayjs(new Date(batch.vbt_start_date)));
        setVarBackTestEndDate(dayjs(new Date(batch.vbt_end_date)));
      }
      setholdingPeriodValue(
        batch.var_gapping ? batch.var_gapping.toString() : "0"
      );
      setSelectedRunDays(setRunDaysArrayFromString(batch.run_days));
      if (!initialRenderDone) {
        setLegelEntityTableData(legelEntityData);
        setInitialRenderDone(true);
        setIsSelectAllChecked(
          legelEntityIdNames?.length === legelEntityData?.length
        );
      }
    } else {
      setPopupTitle("New");
      setBatchId(0);
      setLegelEntityIdAndNameList(legelEntityIdNames);
      setVarConfigurationList(varLevels);
      setScheduleTimeFromString("00:00");
      setPeriodValue("12");
      setPeriodMeasure("months");
      setholdingPeriodValue("1");
    }
  }, [mode, batch, legelEntityData, legelEntityIdNames, initialRenderDone]);

  return (
    <CustomModal
      isOpen={isOpen}
      handleClose={batchConfigurationCloseCallback}
      headerClassName="tw-text-xl tw-font-bold "
      title={<MuiBox>Batch Configuration : {popupTitle}</MuiBox>}
      maxWidth="lg"
      classNames="tw-w-4/5 tw-h-full"
    >
      <MuiBox className="tw-mt-1" component="form">
        <MuiBox className="tw-grid lg:tw-grid-cols-5 md:tw-grid-cols-5 sm:tw-grid-cols-1">
          <MuiBox className="tw-flex lg:tw-col-span-3 md:tw-col-span-3 sm:tw-col-span-1">
            <MuiTypography className="tw-text-sm tw-mt-1.5 ">
              Batch Name:
            </MuiTypography>
            <MuiTextField
              sx={entitySelectionTextBoxStyle}
              variant="outlined"
              value={batchName}
              onChange={handleBatchNameChange}
              helperText={
                !isBatchNameValid
                  ? "Batch Name is required and it must be unique."
                  : "\u00A0"
              }
              error={!isBatchNameValid}
            />
            <MuiBox className="tw-flex tw-ml-8">
              <MuiTypography className="tw-text-sm tw-mt-1.5 ">
                Critical Batch :
              </MuiTypography>
              <MuiCheckbox
                checked={isCriticalBatch}
                value={isCriticalBatch}
                onChange={handleCriticalBatchValueChange}
                sx={checkboxStyles.root}
                disableRipple
              />
            </MuiBox>
          </MuiBox>
          <MuiBox className=" lg:tw-col-span-2 md:tw-col-span-2 sm:tw-col-span-1">
            <MuiTypography className="tw-text-sm">Batch Type</MuiTypography>
            <MuiFormControl>
              <MuiRadioGroup
                value={selectedBatchType}
                defaultValue={BATCH_TYPES.REGULAR}
                onChange={handleBatchTypeChange}
              >
                <MuiBox className="tw-grid tw-grid-cols-2">
                  <MuiFormControlLabel
                    value={BATCH_TYPES.REGULAR}
                    control={<Radio size="small" />}
                    label={
                      <MuiTypography className="tw-text-sm">
                        Regular
                      </MuiTypography>
                    }
                  />
                  <MuiFormControlLabel
                    value={BATCH_TYPES.VBT}
                    control={<Radio size="small" />}
                    label={
                      <MuiTypography className="tw-text-sm">
                        VaR Back Test
                      </MuiTypography>
                    }
                  />
                  <MuiFormControlLabel
                    value={BATCH_TYPES.SPOT_VOL}
                    control={<Radio size="small" />}
                    label={
                      <MuiTypography className="tw-text-sm">
                        Spot-Vol
                      </MuiTypography>
                    }
                  />
                  <MuiFormControlLabel
                    value={BATCH_TYPES.UNIT_VAR}
                    control={<Radio size="small" />}
                    label={
                      <MuiTypography className="tw-text-sm">
                        Unit-VaR
                      </MuiTypography>
                    }
                  />
                </MuiBox>
              </MuiRadioGroup>
            </MuiFormControl>
          </MuiBox>
        </MuiBox>

        <MuiBox className="tw-h-44 tw-mb-2">
          <MuiStack direction="row" justifyContent="space-between">
            <MuiBox>
              <MuiTypography className="tw-text-sm tw-mt-2">
                Portfolio
              </MuiTypography>
            </MuiBox>
            <MuiBox className="tw-text-right">
              <MuiButton
                className=" tw-bg-slate-500 tw-text-white tw-m-0.5 tw-ml-16 tw-text-xs tw-font-normal"
                sx={{ width: "32px", minWidth: "32px", height: "32px" }}
                onClick={onAddEntity}
                disabled={selectedBatchType === BATCH_TYPES.UNIT_VAR}
              >
                <MuiTooltip title="Add Entity">
                  <AddIcon />
                </MuiTooltip>
              </MuiButton>
              <MuiButton
                className=" tw-bg-slate-500 tw-text-white tw-m-0.5 tw-text-xs tw-font-normal"
                sx={{ width: "32px", minWidth: "32px", height: "32px" }}
                onClick={onDeleteEntity}
                disabled={!selectedEntity}
              >
                <MuiTooltip title="Delete Entity">
                  <DeleteIcon />
                </MuiTooltip>
              </MuiButton>
            </MuiBox>
          </MuiStack>
          <PortfolioConfig
            legelEntityData={legelEntityTableData}
            editAccountsCallback={onEditEntityAccounts}
            onRowSelection={onLegelEntityRowSelection}
          />
          <CustomModal
            key={"EntitySelectionModal"}
            isOpen={isOpenEntitySelection}
            handleClose={handleEntitySelectionClose}
            headerClassName="tw-text-xl tw-font-bold "
            title={
              <MuiBox>
                <MuiTypography className="tw-text-sm">
                  Entity Selection
                </MuiTypography>
              </MuiBox>
            }
            maxWidth="lg"
          >
            <EntitySelection
              searchTerm={searchTerm}
              handleSearchTermChange={handleSearchTerm}
              isSelectAllChecked={isSelectAllChecked}
              handleSelectAllValueChange={handleSelectAllValueChange}
              filteredEntityData={filteredEntityData}
              selectedEntityList={selectedEntityList}
              handleToggleEntitySelection={handleToggleEntitySelection}
              handleEntitySelectionSaveCallback={handleEntitySelectionSave}
              handleEntitySelectionCloseCallback={handleEntitySelectionClose}
            />
          </CustomModal>
          <CustomModal
            key={"AccountSelectionModal"}
            isOpen={isOpenAccountSelection}
            handleClose={handleAccountSelectionClose}
            headerClassName="tw-text-xl tw-font-bold "
            title={
              <MuiBox>
                <MuiTypography className="tw-text-sm">
                  {`Account Selection (${selectedEntity?.name as string})`}
                </MuiTypography>
              </MuiBox>
            }
            maxWidth="lg"
          >
            <AccountSelection
              searchTerm={searchTerm}
              handleSearchTermChange={handleSearchTerm}
              filteredAccData={filteredAccData}
              selectedEntity={selectedEntity as LegalEntity}
              handleToggleAccountSelection={handleToggleAccountSelection}
              selectedAccountList={selectedAccountList}
              handleAccountSelectionSaveCallback={handleAccountSelectionSave}
              handleAccountSelectionCloseCallback={handleAccountSelectionClose}
            />
          </CustomModal>
        </MuiBox>

        <MuiBox className="tw-h-44 tw-mb-2">
          <AggregateConfig
            batchAggregationList={aggregationHierarchyList}
            IsVarBackTestBatch={isVarBackTestBatch}
            batchVarLevelList={varConfigurationList}
            onHierarchySave={onAddNewHierarchy}
            onHierarchyDelete={onDeleteHierarchy}
            onVarConfigSave={onAddNewVarConfig}
            selectedBatchType={selectedBatchType}
          />
        </MuiBox>

        <PeriodCustomSelection
          isCustomPeriodSelected={isCustomPeriodSelected}
          IsVarBackTestBatch={isVarBackTestBatch}
          handlePeriodChangeCallback={handlePeriodCheckBoxChange}
          periodValue={periodValue}
          handlePeriodValueChangeCallback={handlePeriodValueChange}
          isPeriodValid={isPeriodValid}
          periodMeasure={periodMeasure}
          handlePeriodMeasureChangeCallback={handlePeriodMeasureChange}
          holdingPeriodValue={holdingPeriodValue}
          handleholdingPeriodValueChangeCallback={
            handleholdingPeriodValueChange
          }
          handleCustomPeriodCheckBoxChangeCallback={
            handleCustomPeriodCheckBoxChange
          }
          handleStartDateChangeCallback={handleStartDateChange}
          isHoldingPeriodValid={isHoldingPeriodValid}
          startDate={startDate}
          handleEndDateChangeCallback={handleEndDateChange}
          endDate={endDate}
          isValidCustomPeriod={isValidCustomPeriod}
        />

        <VarBackTestSelection
          IsVarBackTestBatch={isVarBackTestBatch}
          isValidVarBackTestPeriod={isValidVarBackTestPeriod}
          startDate={varBackTestStartDate}
          handleVarBackTestStartDateCallback={handleVarBackTestStartDateChange}
          endDate={varBackTestEndDate}
          handleVarBackTestEndDateCallback={handleVarBackTestEndDateChange}
          selectedBatchType={selectedBatchType}
        />
        <ScenarioAnalysis
          selectedMatrix={selectedMatrix}
          selectedBatchType={selectedBatchType}
          matrixChangeCallback={handleMatrixChange}
          spotVolGridChangeCallback={handleSpotVolGridValueChange}
          matricsData={selectedMatrix}
          selectedSpotVolGrid={selectedSpotVolGrid}
        />
        <ScheduleSelection
          isHoldingPeriodValid={isHoldingPeriodValid}
          isScheduledBatch={isScheduledBatch}
          handleScheduleCheckboxValueChange={handleScheduleCheckboxValueChange}
          scheduleTimeValue={scheduleTimeValue}
          handleScheduleTimeValueChange={handleScheduleTimeValueChange}
          selectedRunDays={selectedRunDays}
          hanndleRunDayTypeCheck={hanndleRunDayTypeCheck}
          isScheduleValid={isScheduleValid}
          IsVarBackTestBatch={isVarBackTestBatch}
        />
      </MuiBox>
      <MuiBox className="tw-flex tw-justify-end tw-mt-2">
        <MuiButton className="tw-m-1 tw-bg-slate-75" onClick={onSave}>
          Save
        </MuiButton>
        <MuiButton
          className="tw-m-1 tw-bg-slate-75"
          onClick={handleBatchConfigurationClose}
        >
          Cancel
        </MuiButton>
      </MuiBox>
    </CustomModal>
  );
};

export default BatchConfigEdit;
