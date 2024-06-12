import { AxiosResponse } from "axios";
import { apiClientV1 } from "@/utils/http";
import { QueryKeys } from "@/constants/keys";
import { createMutation, createQuery } from "react-query-kit";
import { makeCreateWalletEndpoint, makeGetCurrencyListEndpoint, makeGetWalletListEndpoint } from "@/constants/endpoints";
import { CreateWalletRequestData, CreateWalletResponseResource, GetCurrenciesResponse, WalletListResponseResource } from "@/types/api-response";

export const useGetWalletListQuery = createQuery<WalletListResponseResource>({
    queryKey: [QueryKeys.WALLET_LIST],
    fetcher: async () => {
        const response = await apiClientV1.get<WalletListResponseResource>(makeGetWalletListEndpoint());
        return response.data;
    }
})

export const useCreateWalletMutation = createMutation<CreateWalletResponseResource, CreateWalletRequestData>({
    mutationFn: async (variables) => {
        const response = await apiClientV1
            .post<CreateWalletResponseResource, AxiosResponse<CreateWalletResponseResource>, CreateWalletRequestData>(makeCreateWalletEndpoint(), variables);
        return response.data;
    }
});

export const useGetCurrenciesQuery = createQuery<GetCurrenciesResponse>({
    queryKey: [QueryKeys.CURRENCY_LIST],
    async fetcher() {
        const response = await apiClientV1.get<GetCurrenciesResponse>(makeGetCurrencyListEndpoint());
        return response.data;
    }
})