export type ErrorType = {
  data: ErrorDetails | string;
  status: any;
};

export type ErrorDetails = {
  error: string;
  code: string;
};
