import {
  FormControl,
  FormControlProps,
  FormControlLabel,
  FormControlLabelProps,
  FormGroup,
  FormGroupProps,
  FormLabel,
  FormLabelProps,
  FormHelperTextProps,
  FormHelperText,
} from "@mui/material";

export const MuiFormControl = (props: FormControlProps) => (
  <FormControl {...props} />
);

export const MuiFormControlLabel = (props: FormControlLabelProps) => (
  <FormControlLabel {...props} />
);

export const MuiFormGroup = (props: FormGroupProps) => <FormGroup {...props} />;

export const MuiFormLabel = (props: FormLabelProps) => <FormLabel {...props} />;

export const MuiFormHelperText = (props: FormHelperTextProps) => (
  <FormHelperText {...props} />
);
