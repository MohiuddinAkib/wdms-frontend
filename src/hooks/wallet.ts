import { AxiosResponse } from "axios";
import { apiClientV1 } from "@/utils/http";
import { QueryKeys } from "@/constants/keys";
import { createMutation, createQuery } from "react-query-kit";
import { makeAddMoneyTransactionEndpoint, makeAddWalletDenominationEndpoint, makeCreateWalletEndpoint, makeDeleteWalletDenominationEndpoint, makeDeleteWalletEndpoint, makeGetCurrencyDenominationListEndpoint, makeGetCurrencyListEndpoint, makeGetTransactionListEndpoint, makeGetWalletDetailsEndpoint, makeGetWalletListEndpoint, makeWithdrawMoneyTransactionEndpoint } from "@/constants/endpoints";
import { AddMoneyTransactionRequestData, AddMoneyTransactionResponseResource, AddWalletDenominationRequestData, AddWalletDenominationResponseResource, CreateWalletRequestData, CreateWalletResponseResource, DeleteWalletDenominationResponseResource, DeleteWalletResponseResource, GetCurrenciesResponse, GetDenominationsResponse, PaginatedData, TransactionListQueryParams, TransactionResource, WalletDetailsResponseResource, WalletListResponseResource, WithdrawMoneyTransactionRequestData, WithdrawMoneyTransactionResponseResource } from "@/types/api-response";

export const useGetWalletListQuery = createQuery<WalletListResponseResource>({
    queryKey: [QueryKeys.WALLET, "list"],
    fetcher: async () => {
        const response = await apiClientV1.get<WalletListResponseResource>(makeGetWalletListEndpoint());
        return response.data;
    }
})

export const useGetWalletDetailsQuery = createQuery<WalletDetailsResponseResource, { walletId: string }>({
    queryKey: [QueryKeys.WALLET],
    fetcher: async ({ walletId }) => {
        const response = await apiClientV1.get<WalletDetailsResponseResource>(makeGetWalletDetailsEndpoint(walletId));
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

export const useRemoveWalletMutation = createMutation<DeleteWalletResponseResource, {walletId: string}>({
    mutationFn: async (variables) => {
        const response = await apiClientV1
            .delete<DeleteWalletResponseResource, AxiosResponse<DeleteWalletResponseResource>>(makeDeleteWalletEndpoint(variables.walletId));
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

export const useGetCurrencyDenominationsQuery = createQuery<GetDenominationsResponse, { currency: string }>({
    queryKey: [QueryKeys.DENOMINATION_LIST],
    async fetcher({ currency }) {
        const response = await apiClientV1.get<GetDenominationsResponse>(makeGetCurrencyDenominationListEndpoint(currency));
        return response.data;
    }
})

export const useAddWalletDenominationMutation = createMutation<AddWalletDenominationResponseResource, AddWalletDenominationRequestData & { walletId: string }>({
    mutationFn: async (variables) => {
        const response = await apiClientV1
            .post<AddWalletDenominationResponseResource, AxiosResponse<AddWalletDenominationResponseResource>, AddWalletDenominationRequestData>(makeAddWalletDenominationEndpoint(variables.walletId), variables);

        return response.data;
    }
})

export const useRemoveWalletDenominationMutation = createMutation<DeleteWalletDenominationResponseResource, { walletId: string; denominationId: string }>({
    mutationFn: async (variables) => {
        const response = await apiClientV1
            .delete<DeleteWalletDenominationResponseResource, AxiosResponse<DeleteWalletDenominationResponseResource>, AddWalletDenominationRequestData>(makeDeleteWalletDenominationEndpoint(variables.walletId, variables.denominationId));

        return response.data;
    }
})

export const useAddWalletBalaneMutation = createMutation<AddMoneyTransactionResponseResource, AddMoneyTransactionRequestData & { walletId: string }>({
    mutationFn: async (variables) => {
        const response = await apiClientV1
            .post<AddMoneyTransactionResponseResource, AxiosResponse<AddMoneyTransactionResponseResource>, AddMoneyTransactionRequestData>(makeAddMoneyTransactionEndpoint(variables.walletId), variables);

        return response.data;
    }
})

export const useWithdrawWalletBalaneMutation = createMutation<WithdrawMoneyTransactionResponseResource, WithdrawMoneyTransactionRequestData & { walletId: string }>({
    mutationFn: async (variables) => {
        const response = await apiClientV1
            .post<WithdrawMoneyTransactionResponseResource, AxiosResponse<WithdrawMoneyTransactionResponseResource>, WithdrawMoneyTransactionRequestData>(makeWithdrawMoneyTransactionEndpoint(variables.walletId), variables);

        return response.data;
    }
})

export const useGetTransactionListQuery = createQuery<PaginatedData<TransactionResource>, TransactionListQueryParams>({
    queryKey: [QueryKeys.TRANSACTION, "list"],
    async fetcher(variables) {
        const response = await apiClientV1
            .get<PaginatedData<TransactionResource>, AxiosResponse<PaginatedData<TransactionResource>>, TransactionListQueryParams>(makeGetTransactionListEndpoint(), {
                params: variables
            });

        return response.data;
    }
})