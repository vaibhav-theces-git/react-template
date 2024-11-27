import { Autocomplete, Radio } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { MuiBox } from "src/common/components/box/MuiBox";
import { MuiButton } from "src/common/components/button/MuiButtons/MuiButton";
import {
  MuiFormControl,
  MuiFormControlLabel,
} from "src/common/components/form/MuiForms";
import { MuiTextField } from "src/common/components/input/MuiInputs";
import { MuiMenuItem } from "src/common/components/menu/MuiMenu";
import { CustomModal } from "src/common/components/modal/MuiModal/CustomModal";
import { MuiRadioGroup } from "src/common/components/radio/MuiRadioGroup";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import { SETUPTYPE } from "src/common/constants/sytheticPortfolioConstants";
import {
  batchListResponseType,
  portfolioListResponseType,
} from "src/types/syntheticPortfolioTypes";

interface PortfolioSetupProps {
  isModalOpen: boolean;
  onModalClose: () => void;
  newPorfolioNameChange: (name: string) => void;
  existingPortfolioList: portfolioListResponseType[] | undefined;
  existingPortfolioSelection: (
    selectedRow: portfolioListResponseType | batchListResponseType | undefined,
    optionValue: number | null
  ) => void;
  portfolioSaveCallback: () => void;
  portfolioCancelCallback: () => void;
  batchList: batchListResponseType[] | undefined;
}

const PortfolioSetup = (portfolioSetupProps: PortfolioSetupProps) => {
  const {
    isModalOpen,
    onModalClose,
    newPorfolioNameChange,
    existingPortfolioList,
    existingPortfolioSelection,
    portfolioSaveCallback,
    portfolioCancelCallback,
    batchList,
  } = portfolioSetupProps;

  const [newPortfolioName, setNewPortfolioName] = useState<string>("");
  const [selectedSetup, setSelectedSetup] = useState(SETUPTYPE.NEW);
  const [optionValue, setOptionValue] = useState<number | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] =
    useState<portfolioListResponseType | null>(null);
  const [selectedBatch, setSelectedBatch] =
    useState<batchListResponseType | null>(null);

  const handleSetupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSetup((event.target as HTMLInputElement).value);
    switch ((event.target as HTMLInputElement).value) {
      case SETUPTYPE.NEW:
        setOptionValue(1);
        break;
      case SETUPTYPE.EXISTING:
        setOptionValue(2);
        break;
      case SETUPTYPE.BATCH:
        setOptionValue(3);
        break;
      default:
        setOptionValue(1);
    }
    setNewPortfolioName("");
    setSelectedPortfolio(null);
    setSelectedBatch(null);
  };

  const portfolioNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOptionValue(1);
    setNewPortfolioName(event.target.value);
    if (event.target.value.length > 0) {
      newPorfolioNameChange(event.target.value);
    }
  };

  const handlePortfolioChange = (
    event: React.SyntheticEvent,
    newValue: portfolioListResponseType | null
  ) => {
    setSelectedPortfolio(newValue);
    if (newValue) {
      existingPortfolioSelection(newValue, optionValue);
    }
  };

  const handleBatchChange = (
    event: React.SyntheticEvent,
    newValue: batchListResponseType | null
  ) => {
    setSelectedBatch(newValue);
    if (newValue) {
      existingPortfolioSelection(newValue, optionValue);
    }
  };

  return (
    <CustomModal
      key={"porfolioSetupModal"}
      isOpen={isModalOpen}
      handleClose={onModalClose}
      headerClassName="tw-text-xl tw-font-bold "
      title={
        <MuiBox>
          <MuiTypography className="tw-text-sm">Portfolio setup</MuiTypography>
        </MuiBox>
      }
      maxWidth="lg"
    >
      <MuiBox className="tw-mt-2">
        <MuiFormControl>
          <MuiRadioGroup
            value={selectedSetup}
            defaultValue={selectedSetup}
            onChange={handleSetupChange}
          >
            <MuiFormControlLabel
              value={SETUPTYPE.NEW}
              control={<Radio size="small" />}
              label={
                <MuiTypography className="tw-text-sm">
                  Create new portfolio
                </MuiTypography>
              }
            />
          </MuiRadioGroup>
        </MuiFormControl>
        <MuiBox className="tw-ml-14">
          <MuiTextField
            sx={{
              "& .MuiInputBase-root": {
                height: 30,
              },
              width: "288px",
            }}
            variant="outlined"
            value={newPortfolioName}
            onChange={portfolioNameChange}
            disabled={
              selectedSetup === SETUPTYPE.EXISTING ||
              selectedSetup === SETUPTYPE.BATCH
            }
          />
        </MuiBox>
        <MuiFormControl>
          <MuiRadioGroup
            value={selectedSetup}
            defaultValue={selectedSetup}
            onChange={handleSetupChange}
          >
            <MuiFormControlLabel
              value={SETUPTYPE.EXISTING}
              control={<Radio size="small" />}
              label={
                <MuiTypography className="tw-text-sm">
                  Select existing portfolio
                </MuiTypography>
              }
            />
          </MuiRadioGroup>
        </MuiFormControl>
        <MuiBox className="tw-ml-14 tw-h-auto">
          <MuiBox className="ag-theme-alpine tw-max-h-56 tw-overflow-y-auto tw-w-72">
            <Autocomplete
              disabled={
                selectedSetup === SETUPTYPE.NEW ||
                selectedSetup === SETUPTYPE.BATCH
              }
              options={existingPortfolioList || []}
              getOptionLabel={(option) => option.portfolio_name}
              renderOption={(props, option) => (
                <MuiMenuItem {...props} key={option.portfolio_id}>
                  {option.portfolio_name}
                </MuiMenuItem>
              )}
              onChange={handlePortfolioChange}
              value={selectedPortfolio}
              renderInput={(params) => (
                <MuiTextField {...params} size="small" />
              )}
              ListboxProps={{
                style: {
                  maxHeight: "200px",
                  overflowY: "auto",
                },
              }}
            />
          </MuiBox>
        </MuiBox>
        <MuiFormControl>
          <MuiRadioGroup
            value={selectedSetup}
            defaultValue={selectedSetup}
            onChange={handleSetupChange}
          >
            <MuiFormControlLabel
              value={SETUPTYPE.BATCH}
              control={<Radio size="small" />}
              label={
                <MuiTypography className="tw-text-sm">
                  Select batch
                </MuiTypography>
              }
            />
          </MuiRadioGroup>
        </MuiFormControl>
        <MuiBox className="tw-ml-14 tw-h-auto">
          <MuiBox className="ag-theme-alpine tw-max-h-56 tw-overflow-y-auto tw-w-72">
            <Autocomplete
              disabled={
                selectedSetup === SETUPTYPE.NEW ||
                selectedSetup === SETUPTYPE.EXISTING
              }
              options={batchList || []}
              getOptionLabel={(option) => option.portfolio_name}
              renderOption={(props, option) => (
                <MuiMenuItem {...props} key={option.audit_batch_id}>
                  {option.portfolio_name}
                </MuiMenuItem>
              )}
              onChange={handleBatchChange}
              value={selectedBatch}
              renderInput={(params) => (
                <MuiTextField {...params} size="small" />
              )}
              ListboxProps={{
                style: {
                  maxHeight: "200px",
                  overflowY: "auto",
                },
              }}
            />
          </MuiBox>
        </MuiBox>
        <MuiBox className="tw-flex tw-justify-end tw-mt-3">
          <MuiButton
            className="tw-m-1 tw-bg-slate-75 tw-text-sm"
            onClick={portfolioSaveCallback}
          >
            {selectedSetup === "new" ? "Save" : "Load"}
          </MuiButton>
          <MuiButton
            className="tw-m-1 tw-bg-slate-75 tw-text-sm"
            onClick={portfolioCancelCallback}
          >
            Cancel
          </MuiButton>
        </MuiBox>
      </MuiBox>
    </CustomModal>
  );
};

export default PortfolioSetup;
