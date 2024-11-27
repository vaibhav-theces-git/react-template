import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "src/utitlites/xhrUtils/axiosBaseQuery";

const API_REDUCER_PATH = "universalApiData";

const url = process.env.REACT_APP_BASE_URL as string;
const BASE_URL = url;

export const baseUniversalApi = createApi({
  reducerPath: API_REDUCER_PATH,
  baseQuery: axiosBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: () => ({}),
});
