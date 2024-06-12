export function makeLoginEndpoint() {
    return "auth/login" as const;
}

export function makeRequestOtpEndpoint() {
    return "auth/request-otp" as const;
}

export function makeRegisterEndpoint() {
    return "auth/register" as const;
}