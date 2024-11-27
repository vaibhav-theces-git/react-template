import React, { useState } from "react";
import { MuiBox } from "src/common/components/box/MuiBox";
import { MuiButton } from "src/common/components/button/MuiButtons/MuiButton";
import { MuiTextField } from "src/common/components/input/MuiInputs";
import { CustomModal } from "src/common/components/modal/MuiModal/CustomModal";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import { BatchVarResponseType } from "src/types/batchConfigurationTypes";

export interface AddVarConfigProps {
  isOpen: boolean;
  onCloseCallback: () => void;
  onSaveCallback: (newVarConfig: BatchVarResponseType) => void;
}

const AddVarConfig = (addVarConfigProps: AddVarConfigProps) => {
  const { isOpen, onCloseCallback, onSaveCallback } = addVarConfigProps;
  const [varConfigName, setVarConfigName] = useState("");
  const [varConfigValue, setVarConfigValue] = useState("");

  const onVarConfigNameChange = (event: { target: { value: any } }) => {
    setVarConfigName(event.target.value);
  };

  const onVarConfigValueChange = (event: { target: { value: any } }) => {
    setVarConfigValue(event.target.value);
  };

  const handleVarConfigSave = () => {
    const newVC: BatchVarResponseType = {
      name: varConfigName,
      value: varConfigValue,
    };
    onSaveCallback(newVC);
    setVarConfigName("");
    setVarConfigValue("");
    onCloseCallback();
  };

  return (
    <div>
      <CustomModal
        isOpen={isOpen}
        handleClose={onCloseCallback}
        headerClassName="tw-text-xl tw-font-bold "
        title={
          <MuiBox>
            <MuiTypography className="tw-text-sm">
              VaR Configuration : Add New
            </MuiTypography>
          </MuiBox>
        }
        maxWidth="lg"
      >
        <MuiBox className="tw-w-72 tw-h-36">
          <MuiBox className="tw-mb-2">
            <MuiTypography className="tw-text-sm">Interval</MuiTypography>
            <MuiTextField
              sx={{
                width: { sm: 200, md: 300 },
                "& .MuiInputBase-root": {
                  height: 30,
                },
              }}
              variant="outlined"
              value={varConfigName}
              onChange={onVarConfigNameChange}
            />
          </MuiBox>
          <MuiBox className="tw-mb-2">
            <MuiTypography className="tw-text-sm">Value</MuiTypography>
            <MuiTextField
              sx={{
                width: { sm: 200, md: 300 },
                "& .MuiInputBase-root": {
                  height: 30,
                },
              }}
              variant="outlined"
              value={varConfigValue}
              onChange={onVarConfigValueChange}
            />
          </MuiBox>
          <MuiBox className="tw-flex tw-justify-end tw-mt-2">
            <MuiButton onClick={handleVarConfigSave}>Save</MuiButton>
            <MuiButton onClick={onCloseCallback}>Cancel</MuiButton>
          </MuiBox>
        </MuiBox>
      </CustomModal>
    </div>
  );
};

export default AddVarConfig;
