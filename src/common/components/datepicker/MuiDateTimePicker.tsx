import {
  DateTimePicker,
  DateTimePickerProps,
} from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "./MuiDatePicker.module.scss";
import { Dayjs } from "dayjs";

// const MuiDateTimePicker = <TInputDate, TDate>(
//   props: DateTimePickerProps<TInputDate, TDate>
// ) => (
//   <LocalizationProvider dateAdapter={AdapterDateFns}>
//     <DateTimePicker {...props} />
//   </LocalizationProvider>
// );

export interface MuiDateTimePickerProps extends DateTimePickerProps<Dayjs> {}

const MuiDateTimePicker: React.FC<MuiDateTimePickerProps> = (
  props: MuiDateTimePickerProps
) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DateTimePicker {...props} />
  </LocalizationProvider>
);

export default MuiDateTimePicker;
