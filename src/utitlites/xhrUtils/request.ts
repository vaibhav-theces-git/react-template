import axios, { AxiosRequestConfig } from "axios";

const isHandlerEnabled = (config: AxiosRequestConfig) => {
  return !(
    Object.prototype.hasOwnProperty.call(config, "handlerEnabled") &&
    !config.handlerEnabled
  );
};

const axiosRequest = axios.create();

// eslint-disable-next-line @typescript-eslint/require-await
const requestHandler = async (request: AxiosRequestConfig): Promise<any> => {
  if (isHandlerEnabled(request)) {
    // eslint-disable-next-line no-param-reassign
    request.headers = {
      ...request.headers,
      ...{
        "X-Requested-With": "XMLHttpRequest",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
  return request;
};

axiosRequest.interceptors.request.use(
  (request) => requestHandler(request),
  (error) => Promise.reject(error)
);

export default axiosRequest;
