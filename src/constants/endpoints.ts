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

export function makeGetUserProfileEndpoint() {
    return "user" as const;
}