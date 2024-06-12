import { csrfMutex } from "./mutex";
import localforage from "localforage";
import { StorageKeys } from "@/constants/keys";
import { ErrorResponse, } from "@/types/api-response";
import axios, { AxiosError, HttpStatusCode, InternalAxiosRequestConfig } from "axios";
import { ApplicationError, StoredAuthData } from "@/types/app-contract";

const API_V1_BASE_URL = new URL("api", import.meta.env.VITE_APP_API_BASE ?? "http://localhost");

export async function getCsrfToken() {
  if (!csrfMutex.isLocked()) {
    console.log("lock nai");

    const release = await csrfMutex.acquire();

    console.log("lock krlm");

    try {
      console.log("/sanctum/csrf-cookie e hit kre csrf token anbo");

      await axios.get(
        `${import.meta.env.VITE_APP_API_BASE ?? "http://localhost"}/sanctum/csrf-cookie`,
        {
          withXSRFToken: true,
          withCredentials: true,
        }
      )

      console.log("/sanctum/csrf-cookie theke csrf token anlam");
    } finally {
      // release must be called once the mutex should be released again.
      release();
    }
  } else {
    console.log("lock ty wait krtesi");

    // wait until the mutex is available without locking it
    await csrfMutex.waitForUnlock();
    console.log(
      "lock chilo wait krar pore request ta abar try kre dektesi"
    );
  }
}

function makeApplicationError(
  err: AxiosError<ErrorResponse> | Error,
): ApplicationError {
  const isCancelledError = axios.isCancel(err);

  let field_errors: Record<string, string> = {};
  let non_field_error: string = "Something went wrong";
  let statusCode = HttpStatusCode.InternalServerError;

  if (axios.isAxiosError<ErrorResponse>(err) && !!err.response?.data) {
    console.log("error inside makeApplicationError is", err.response.data);

    statusCode = err.response.status;
    non_field_error = err.response.data.message;


    field_errors = Object.entries(err.response.data.errors ?? {}).reduce(
      (acc, [fieldName, fieldErrors]) => {
        acc[fieldName] = fieldErrors[0];
        return acc;
      },
      {} as Record<string, string>,
    );

  } else {
    non_field_error = err.message;
  }

  return {
    statusCode,
    field_errors,
    non_field_error,
    isCancelledError
  };
}

const apiClientV1 = axios.create({
  withXSRFToken: true,
  withCredentials: true,
  baseURL: API_V1_BASE_URL.toString(),
  headers: {
    Accept: "application/json",
  },
});

apiClientV1.interceptors.request.use(
  async function (config) {
    await csrfMutex.waitForUnlock();

    const authData = await localforage.getItem<StoredAuthData>(
      StorageKeys.AUTH_DATA,
    );

    if (authData?.token) {
      config.headers.Authorization = `Bearer ${authData.token}`;
    }

    return config;
  },
  function (error) {
    console.log("client request error", error);

    return Promise.reject(error);
  },
);

apiClientV1.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error: AxiosError<ErrorResponse>) {
    const applicationError = makeApplicationError(error);
    const isCsrfMismatch = applicationError.statusCode === 419

    const originalConfig = error.config! as InternalAxiosRequestConfig & { _retry: number }
    if (originalConfig._retry === undefined) {
      originalConfig._retry = 0;
    }


    if (isCsrfMismatch && originalConfig._retry < 5) {
      originalConfig._retry++;
      await getCsrfToken();

      return apiClientV1(originalConfig);
    }

    return Promise.reject(applicationError);
  },
);

export { apiClientV1 };
