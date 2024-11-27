/* eslint-disable */

import {
  DatePickerProps as MuiDatePickerProps,
  DesktopDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

// export interface MuiDatePickerProps extends DatePickerProps<Dayjs> {}
export interface CustomMuiDatePickerProps<Dayjs>
  extends MuiDatePickerProps<Dayjs> {
  fontSize?: number;
  width?: number;
}

const MuiDatePicker: React.FC<CustomMuiDatePickerProps<Dayjs>> = (
  props: CustomMuiDatePickerProps<Dayjs>
) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DesktopDatePicker
      {...props}
      slotProps={{
        textField: {
          inputProps: {
            style: {
              padding: 0,
              paddingLeft: 5,
              fontSize: props.fontSize || 10,
              height: "30px",
              width: props.width || "62px",
            },
          },
        },
        day: {
          sx: {
            "&.MuiPickersDay-root.Mui-selected": {
              backgroundColor: "white",
            },
          },
        },
      }}
    />
  </LocalizationProvider>
);
export default MuiDatePicker;
