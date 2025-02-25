import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TokenService } from './services/token.service';
import { ITokenResponse } from './interfaces/token-response.interface';
import { ITokenDataResponse } from './interfaces/token-data-response.interface';
import { ITokenDestroyResponse } from './interfaces/token-destroy-response.interface';

@Controller('token')
export class TokenController {
    constructor(private readonly tokenService: TokenService) { }

    @MessagePattern('token_create')
    public async createToken(params: { userId: string }): Promise<ITokenResponse> {
        let result: ITokenResponse;
        if (params && params.userId) {
            try {
                const createResult = await this.tokenService.createToken(params.userId);
                result = {
                    status: HttpStatus.CREATED,
                    system_message: 'token_create_success',
                    token: createResult.token,
                    errors: null,
                };
            } catch (e) {
                result = {
                    status: HttpStatus.BAD_REQUEST,
                    system_message: 'token_create_bad_request',
                    token: null,
                    errors: null,
                };
            }
        } else {
            result = {
                status: HttpStatus.BAD_REQUEST,
                system_message: 'token_create_bad_request',
                token: null,
                errors: null,
            };
        }

        return result;
    }

    @MessagePattern('token_destroy')
    public async destroyToken(params: {
        userId: string;
    }): Promise<ITokenDestroyResponse> {
        return {
            status: params && params.userId ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
            system_message:
                params && params.userId
                    ? (await this.tokenService.deleteTokenForUserId(params.userId)) &&
                    'token_destroy_success'
                    : 'token_destroy_bad_request',
            errors: null,
        };
    }

    @MessagePattern('token_decode')
    public async decodeToken(params: {
        token: string;
    }): Promise<ITokenDataResponse> {
        const tokenData = await this.tokenService.decodeToken(params.token);
        return {
            status: tokenData ? HttpStatus.OK : HttpStatus.UNAUTHORIZED,
            system_message: tokenData ? 'token_decode_success' : 'token_decode_unauthorized',
            data: tokenData,
            errors: null,
        };
    }
}