export interface ITokenDataResponse {
    status: number;
    message: string;
    data: { user_id: string } | null;
}