export interface ITokenDataResponse {
    status: number;
    system_message: string;
    data: { user_id: string } | null;
}