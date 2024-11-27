import dayjs, { Dayjs } from "dayjs";

export const getYYYYMMDDFormattedDateString = (date: Dayjs) => {
  return date
    .year()
    .toString()
    .concat("-")
    .concat((date.month() + 1).toString())
    .concat("-")
    .concat(date.date().toString());
};

export const formattedDateTime = () => {
  const currentDateTime = dayjs();
  const DateTime = currentDateTime.format("YYYY-MM-DD HH:mm:ss");
  return DateTime;
};

// DefaultDate selection for addhoc and scheduled runs on batchconfiguration page
export const date7DaysAgo = () => {
  const today = new Date();
  const previousDate = today.setDate(today.getDate() - 7);
  return previousDate;
};

export const convertDateToMuiFormat = (date: string) => {
  let currentDate = new Date();
  currentDate = new Date(date);
  const defaultBusinessDate = dayjs(
    new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    )
  );
  return defaultBusinessDate;
};
