import { apiClientV1 } from "@/utils/http";
import { QueryKeys } from "@/constants/keys";
import { createQuery } from "react-query-kit";
import { WalletListResponseResource } from "@/types/api-response";
import { makeGetWalletListEndpoint } from "@/constants/endpoints";

export const useGetWalletListQuery = createQuery<WalletListResponseResource>({
    queryKey: [QueryKeys.WALLET_LIST],
    fetcher: async () => {
        const response = await apiClientV1.get<WalletListResponseResource>(makeGetWalletListEndpoint());
        return response.data;
    }
})