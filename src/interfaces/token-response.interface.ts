export interface ITokenResponse {
    status: number;
    system_message: string;
    token: string | null;
    errors: { [key: string]: any } | null;
}