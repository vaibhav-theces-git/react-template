import { AxiosRequestConfig as OriginalAxiosRequestConfig } from "axios";

declare module "axios" {
  export interface AxiosRequestConfig extends OriginalAxiosRequestConfig {
    handlerEnabled?: boolean;
    sends?: null | any[];
    receives?: null | any[];
    hideAlertOnError?: boolean;
  }
}
