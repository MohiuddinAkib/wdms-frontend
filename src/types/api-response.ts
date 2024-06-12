
export type LoginUserData = {
    email: string;
    otp: string;
};

export type UserData = {
    name: string;
    email: string;
}

export type ErrorResponse = {
    message: string;
    errors?: Record<string, string[]>
}

export type RegisterUserData = {
    name: string;
    email: string;
    password: string;
};

export type RequestOtpData = {
    email: string;
    password: string;
};


export type LoginUserResponseResource = {
    success: boolean;
    message: string;
    token: string | null;
};

export type RegisterUserResponseResource = {
    success: boolean;
    message: string;
};

export type RequestOtpResponseResource = {
    success: boolean;
    message: string;
};

export type UserLogoutResponseResource = {
    success: boolean;
    message: string;
};


export type CurrencyResource = {
    code: string;
    name: string | null;
};

export type DenominationResource = {
    name: string;
    type: string;
    value: number;
};


export type AddMoneyTransactionItemRequestData = {
    denomination_id: string;
    quantity: number;
};

export type AddMoneyTransactionRequestData = {
    uuid: string;
    denominations: Array<AddMoneyTransactionItemRequestData>;
};

export type AddWalletDenominationRequestData = {
    currency: string;
    name: string;
    type: string;
    value: number;
};

export type CreateWalletRequestData = {
    currency: string;
};

export type WithdrawMoneyTransactionItemRequestData = {
    denomination_id: string;
    quantity: number;
};

export type WithdrawMoneyTransactionRequestData = {
    uuid: string;
    denominations: Array<WithdrawMoneyTransactionItemRequestData>;
};


export type WithdrawMoneyTransactionResponseResource = {
    success: boolean;
    message: string;
    data: WalletResource;
};


export type AddMoneyTransactionResponseResource = {
    success: boolean;
    message: string;
    data: WalletResource;
};

export type AddWalletDenominationResponseResource = {
    success: boolean;
    data: WalletResource;
};

export type CreateWalletResponseResource = {
    success: boolean;
    message: string;
    data: WalletResource | null;
};

export type DeleteWalletDenominationResponseResource = {
    success: boolean;
    message: string;
};

export type DeleteWalletResponseResource = {
    success: boolean;
    message: string;
};

export type TransactionResource = {
    id: string;
    wallet: WalletResource;
    denomination: WalletDenominationResource;
    type: string;
    quantity: number;
    happened_at: string;
};

export type WalletDenominationResource = {
    id: string;
    name: string;
    type: string;
    value: number;
    quantity: number;
};

export type WalletDetailsResponseResource = {
    success: boolean;
    data: WalletResource;
};

export type WalletListResponseResource = {
    success: boolean;
    data: Array<WalletResource>;
};

export type WalletResource = {
    id: string;
    currency: string;
    balance: string;
    denominations?: Array<WalletDenominationResource>;
};



export type GetCurrenciesResponse = {
    success: boolean;
    data: CurrencyResource[]
}