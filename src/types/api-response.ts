
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
    wallet_id: string;
    wallet_currency: string;
    denomination_id: string;
    denomination_name: string;
    denomination_type: string;
    denomination_quantity: number;
    denomination_value: number;
    type: string;
    happened_at: string;
    group_id: string;
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

export type GetDenominationsResponse = {
    success: boolean;
    data: DenominationResource[]
}
export type Link = {
    url?: string
    label: string
    active: boolean
}

export type PaginatedData<D extends object> = {
    data: D[];
    current_page: number
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: Link[]
    next_page_url?: string
    path: string
    per_page: number
    prev_page_url?: string
    to: number
    total: number
}

export type TransactionListQueryParams = PaginationQueryParams<Partial<{
    walletId: string;
    happened_at_between: `${string},${string}`
}>>

export type PaginationQueryParams<D extends object> = {
    page?: number;
    limit?: number;
} & D