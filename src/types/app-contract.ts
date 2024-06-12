export interface ApplicationError<TFields extends string = string> {
    statusCode: number;
    non_field_error: string;
    isCancelledError: boolean;
    field_errors: Record<TFields, string>;
}

export type StoredAuthData = {
    token: string;
}