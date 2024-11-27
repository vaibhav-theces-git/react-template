import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  LegalEntity,
  LegalEntityPostType,
  LegelEntityAccountType,
  LegelEntityIdsNamesResponseType,
} from "src/types/batchConfigurationTypes";
import { MuiBox } from "src/common/components/box/MuiBox";
import { MuiStack } from "src/common/components/stack/MuiStack";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import { MuiButton } from "src/common/components/button/MuiButtons/MuiButton";
import MuiTooltip from "src/common/components/tooltip/MuiTooltip";
import { CustomModal } from "src/common/components/modal/MuiModal/CustomModal";
import SnackBarUtils, {
  snackbarOption,
} from "src/common/components/SnackBarUtilsConfigurator";
import { useCallback, useEffect, useState } from "react";
import {
  useLazyGetLegelEntityAccountsByIdDataQuery,
  useLazyGetLegelEntityIdsAndNamesDataQuery,
} from "src/queries/legelEntityApi";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { getErrorMessageFromError } from "src/common/utilities/globalUtils";
import { ErrorType } from "src/types/apiErrorTypes";
import { errorPrefix } from "src/common/constants/testids";
import PortfolioConfig from "../batchConfig/PortfolioConfig";
import EntitySelection from "../batchConfig/EntitySelection";
import AccountSelection from "../batchConfig/AccountSelection";

interface AccountProps {
  isModalOpen: boolean;
  onModalClose: () => void;
  saveAccountsCallback: (leAccounts: LegalEntityPostType[]) => void;
  cancelAccountsCallback: () => void;
}
export const Accounts = (accountProps: AccountProps) => {
  const {
    isModalOpen,
    onModalClose,
    saveAccountsCallback,
    cancelAccountsCallback,
  } = accountProps;
  const [legalEntityIdNames, setLegalEntityIdNames] = useState<
    LegelEntityIdsNamesResponseType[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpenEntitySelection, setIsOpenEntitySelection] =
    useState<boolean>(false);
  const [selectedEntity, setSelectedEntity] = useState<LegalEntity>();
  const [isOpenAccountSelection, setIsOpenAccountSelection] =
    useState<boolean>(false);
  const [legelEntityTableData, setLegelEntityTableData] = useState<
    LegalEntity[]
  >([]);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [selectedEntityList, setSelectedEntityList] = useState<
    LegelEntityIdsNamesResponseType[]
  >([]);
  const [accountList, setAccountList] = useState<LegelEntityAccountType[]>([]);
  const [selectedAccountList, setSelectedAccountList] = useState<
    LegelEntityAccountType[]
  >([]);
  const [excludedAccountList, setExcludedAccountList] = useState<
    LegelEntityAccountType[]
  >([]);

  const onAccountsSave = () => {
    const leAccounts: any[] = legelEntityTableData.map((entity) => ({
      le_id: entity.le_id,
      excluded_accts: entity.excluded_accts.map((accId) => accId.acc_id),
    }));
    saveAccountsCallback(leAccounts);
  };

  const [legelEntityIdNameTrigger] =
    useLazyGetLegelEntityIdsAndNamesDataQuery();
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

  const filteredEntityData = legalEntityIdNames?.filter((item) =>
    item?.name?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const filteredAccData = accountList?.filter((item) => {
    const name = item?.name;
    return (
      typeof name === "string" &&
      name.toLowerCase().includes(searchTerm?.toLowerCase())
    );
  });

  const onLegelEntityRowSelection = (row: LegalEntity) => {
    setSelectedEntity(row);
  };

  const onAddEntity = () => {
    setIsOpenEntitySelection(true);
  };

  const handleEntitySelectionClose = () => {
    setIsOpenEntitySelection(false);
    setSearchTerm("");
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
      setSelectedEntityList(legalEntityIdNames);
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
        legalEntityIdNames?.length > 0 &&
        legalEntityIdNames?.length === newChecked?.length
      ) {
        setIsSelectAllChecked(true);
      }
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

  useEffect(() => {
    getLegelEntityIdAndNameList();
  }, [getLegelEntityIdAndNameList]);

  return (
    <CustomModal
      key={"AccountSelectionModal"}
      isOpen={isModalOpen}
      handleClose={onModalClose}
      headerClassName="tw-text-xl tw-font-bold"
      title={
        <MuiBox>
          <MuiTypography className="tw-text-sm">Select accounts</MuiTypography>
        </MuiBox>
      }
      classNames="tw-w-4/5"
      maxWidth="lg"
    >
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
            >
              <MuiTooltip title="Add Entity">
                <AddIcon />
              </MuiTooltip>
            </MuiButton>
            <MuiButton
              className=" tw-bg-slate-500 tw-text-white tw-m-0.5 tw-text-xs tw-font-normal"
              sx={{ width: "32px", minWidth: "32px", height: "32px" }}
              onClick={onDeleteEntity}
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
          handleClose={onModalClose}
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
          handleClose={onModalClose}
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
      <MuiBox className="tw-flex tw-justify-end tw-mt-1">
        <MuiButton
          className="tw-m-1 tw-bg-slate-75 tw-text-sm"
          onClick={onAccountsSave}
        >
          Save
        </MuiButton>
        <MuiButton
          className="tw-m-1 tw-bg-slate-75 tw-text-sm"
          onClick={cancelAccountsCallback}
        >
          Cancel
        </MuiButton>
      </MuiBox>
    </CustomModal>
  );
};
