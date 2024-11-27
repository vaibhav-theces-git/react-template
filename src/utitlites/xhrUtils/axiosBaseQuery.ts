import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import axiosRequest from "./request";

export type AxiosQueryMetaType = Omit<AxiosResponse, "data">;

export type AxiosBaseQueryResponse = {
  data: AxiosResponse["data"];
  meta?: AxiosQueryMetaType;
};

export type AxiosQueryParams = Omit<AxiosRequestConfig, "url" | "baseURL"> & {
  url: string;
};

const axiosBaseQuery =
  (
    { baseUrl: baseURL }: { baseUrl: string },
    includeMetaInResponse?: boolean
  ): BaseQueryFn<
    AxiosQueryParams | string,
    unknown,
    unknown,
    unknown,
    AxiosQueryMetaType
  > =>
  async (obj) => {
    let requestConfig: AxiosRequestConfig =
      typeof obj === "string"
        ? { url: obj }
        : { ...obj, method: obj.method ?? "GET" };
    requestConfig = { ...requestConfig, baseURL };

    try {
      const result = await axiosRequest(requestConfig);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { data: responseData, ...otherResponseProps } = result;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const response: AxiosBaseQueryResponse = { data: responseData };
      if (includeMetaInResponse) {
        response.meta = { ...otherResponseProps };
      }
      return response;
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosBaseQuery;
