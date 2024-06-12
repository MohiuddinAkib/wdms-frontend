import { csrfMutex } from "./mutex";
import localforage from "localforage";
import { StorageKeys } from "@/constants/keys";
import { ErrorResponse, } from "@/types/api-response";
import axios, { AxiosError, HttpStatusCode } from "axios";
import { ApplicationError, StoredAuthData } from "@/types/app-contract";

const API_V1_BASE_URL = new URL("api", import.meta.env.VITE_APP_API_BASE ?? "http://localhost/api");

function getCsrfToken() {
  return axios.get(
    `${API_V1_BASE_URL.toString()}/sanctum/csrf-cookie`,
    {
      withCredentials: true,
    }
  );
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

    const originalConfig = error.config

    if (isCsrfMismatch) {
      if (!csrfMutex.isLocked()) {
        console.log("lock nai");

        const release = await csrfMutex.acquire();

        console.log("lock krlm");

        try {
          console.log("/sanctum/csrf-cookie e hit kre csrf token anbo");

          await getCsrfToken();

          console.log("/sanctum/csrf-cookie theke csrf token anlam");

          // retry the initial query
          return apiClientV1({
            ...originalConfig
          }).catch((_error) => {
            release();

            if (_error.response && _error.response.data) {
              return Promise.reject(_error.response.data);
            }

            return Promise.reject(_error);
          });
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

        return apiClientV1({
          ...originalConfig
        }).catch((_error) => {
          if (_error.response && _error.response.data) {
            return Promise.reject(_error.response.data);
          }

          return Promise.reject(_error);
        });
      }
    }

    return Promise.reject(applicationError);
  },
);

export { apiClientV1 };
