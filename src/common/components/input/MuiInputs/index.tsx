/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import React, { forwardRef } from "react";
import {
  Input,
  InputProps,
  InputLabel,
  InputAdornment,
  InputAdornmentProps,
  InputLabelProps,
  TextField,
  TextFieldProps,
  OutlinedInput,
  OutlinedInputProps,
  TextareaAutosize,
  TextareaAutosizeProps,
} from "@mui/material";
import cx from "classnames";
import { styled } from "@mui/material/styles";
import { MuiBox } from "../../box/MuiBox";
import styles from "./Input.module.css";

export const MuiTextField: React.FC<TextFieldProps> = (
  props: TextFieldProps
) => <TextField {...props} />;

export const MuiInput: React.FC<InputProps> = (props: InputProps) => (
  <Input {...props} />
);

export interface MuiOutlinedInputProps extends OutlinedInputProps {
  helperText?: string;
  hideArrows?: boolean;
  wrapperClassName?: string;
}

export const MuiOutlinedInput: React.FC<MuiOutlinedInputProps> = (
  props: MuiOutlinedInputProps
) => {
  const {
    type,
    className,
    wrapperClassName = "",
    hideArrows,
    helperText,
    ...otherProps
  } = props;
  return (
    <MuiBox className={wrapperClassName}>
      <OutlinedInput
        {...otherProps}
        type={type}
        className={
          type === "number" && hideArrows
            ? cx(className, styles.hideArrows)
            : className
        }
      />
      {helperText ? (
        <p className="tw-text-error tw-mt-0"> {helperText} </p>
      ) : null}
    </MuiBox>
  );
};

const StyledSolidOutlinedInput = styled(MuiOutlinedInput)`
  .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`;

export const MuiSolidInput: React.FC<MuiOutlinedInputProps> = (
  props: MuiOutlinedInputProps
) => {
  return (
    <MuiBox>
      <StyledSolidOutlinedInput {...props} />
    </MuiBox>
  );
};

export const MuiInputLabel: React.FC<InputLabelProps> = forwardRef<
  HTMLLabelElement,
  InputLabelProps
>((props, ref) => <InputLabel ref={ref} {...props} />);

export const MuiInputAdornment: React.FC<InputAdornmentProps> = (
  props: InputAdornmentProps
) => <InputAdornment {...props} />;

interface MuiTextareaAutosizeProps extends TextareaAutosizeProps {
  helperText?: any;
  hideArrows?: boolean;
}

export const MuiTextareaAutosize: React.FC<MuiTextareaAutosizeProps> = (
  props: MuiTextareaAutosizeProps
) => {
  return (
    <MuiBox>
      <TextareaAutosize {...props} />
      {props.helperText ? (
        <p className="tw-text-error tw-mt-0"> {props.helperText} </p>
      ) : null}
    </MuiBox>
  );
};
