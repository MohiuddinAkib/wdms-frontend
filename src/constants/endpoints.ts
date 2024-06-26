export function makeLoginEndpoint() {
    return "auth/login" as const;
}

export function makeRequestOtpEndpoint() {
    return "auth/request-otp" as const;
}

export function makeRegisterEndpoint() {
    return "auth/register" as const;
}

export function makeLogoutEndpoint() {
    return "auth/logout" as const;
}

export function makeGetWalletListEndpoint() {
    return "wallets" as const;
}

export function makeGetWalletDetailsEndpoint(walletId: string) {
    return `wallets/${walletId}` as const;
}

export function makeGetCurrencyListEndpoint() {
    return "currencies" as const;
}


export function makeGetCurrencyDenominationListEndpoint(currency: string) {
    return `currencies/${currency}/denominations` as const;
}


export function makeCreateWalletEndpoint() {
    return "wallets" as const;
}

export function makeDeleteWalletEndpoint(walletId: string) {
    return `wallets/${walletId}` as const;
}

export function makeAddWalletDenominationEndpoint(walletId: string) {
    return `wallets/${walletId}/denominations` as const;
}

export function makeDeleteWalletDenominationEndpoint(walletId: string, denominationId: string) {
    return `wallets/${walletId}/denominations/${denominationId}` as const;
}

export function makeAddMoneyTransactionEndpoint(walletId: string) {
    return `transactions/${walletId}/deposit` as const;
}

export function makeWithdrawMoneyTransactionEndpoint(walletId: string) {
    return `transactions/${walletId}/withdraw` as const;
}

export function makeGetUserProfileEndpoint() {
    return "user" as const;
}

export function makeGetTransactionListEndpoint() {
    return "transactions" as const;
}