import localforage from "localforage";
import { createMutation, createQuery } from "react-query-kit";
import { StoredAuthData } from "@/types/app-contract";
import { QueryKeys, StorageKeys } from "@/constants/keys";
import { LoginUserData, LoginUserResponseResource, RegisterUserData, RegisterUserResponseResource, RequestOtpData, RequestOtpResponseResource, UserData, UserLogoutResponseResource } from "@/types/api-response";
import { apiClientV1 } from "@/utils/http";
import { makeGetUserProfileEndpoint, makeLoginEndpoint, makeLogoutEndpoint, makeRegisterEndpoint, makeRequestOtpEndpoint } from "@/constants/endpoints";
import { AxiosResponse } from "axios";

export const useGetAuthDataQuery = createQuery<
    StoredAuthData | null,
    void,
    Error
>({
    networkMode: "always",
    queryKey: [QueryKeys.AUTH_DATA],
    fetcher() {
        return localforage.getItem<StoredAuthData>(StorageKeys.AUTH_DATA);
    },
});

export const useRegisterUserMutation = createMutation<RegisterUserResponseResource, RegisterUserData>({
    mutationFn: async (variables) => {
        const response = await apiClientV1
            .post<RegisterUserResponseResource, AxiosResponse<RegisterUserResponseResource>, RegisterUserData>(makeRegisterEndpoint(), variables);

        return response.data
    },
})

export const useRequestOtpMutation = createMutation<RequestOtpResponseResource, RequestOtpData>({
    mutationFn: async (variables) => {
        const response = await apiClientV1
            .post<RequestOtpResponseResource, AxiosResponse<RequestOtpResponseResource>, RequestOtpData>(makeRequestOtpEndpoint(), variables);

        return response.data
    },
})

export const useLoginUserMutation = createMutation<LoginUserResponseResource, LoginUserData>({
    mutationFn: async (variables) => {
        const response = await apiClientV1
            .post<LoginUserResponseResource, AxiosResponse<LoginUserResponseResource>, LoginUserData>(makeLoginEndpoint(), variables);

        return response.data
    },
})

export const useStoreAuthDataMutation = createMutation<
    StoredAuthData,
    StoredAuthData,
    Error
>({
    networkMode: "always",
    mutationFn(data) {
        console.log("hahah")
        return localforage.setItem<StoredAuthData>(
            StorageKeys.AUTH_DATA,
            data,
        );
    },
});

export const useLogoutMutation = createMutation<
    UserLogoutResponseResource
>({
    async mutationFn() {
        const [response] = await Promise.all([
            apiClientV1.post(makeLogoutEndpoint()),
            localforage.removeItem(StorageKeys.AUTH_DATA)
        ]);

        return response.data
    },
});

export const useGetUserProfileDataMutation = createQuery<
    UserData
>({
    queryKey: [QueryKeys.USER_PROFILE_DATA],
    async fetcher() {
        const response = await apiClientV1.get<UserData>(
            makeGetUserProfileEndpoint(),
        )



        return response.data
    },
});