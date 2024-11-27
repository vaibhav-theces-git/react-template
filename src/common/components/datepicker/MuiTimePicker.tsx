import {
  LocalizationProvider,
  TimePicker,
  TimePickerProps as MuiTimePickerProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

// export interface MuiTimePickerProps extends TimePickerProps<Dayjs> {}

const MuiTimePicker: React.FC<MuiTimePickerProps<Dayjs>> = (
  props: MuiTimePickerProps<Dayjs>
) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <TimePicker {...props} />
  </LocalizationProvider>
);

export default MuiTimePicker;
