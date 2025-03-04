import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TokenService } from './services/token.service';
import logger from '@rudinesurya/logger';
import { ITokenCreateResponse, ITokenDestroyResponse, ITokenDecodeResponse } from '@rudinesurya/token-service-interfaces';

@Controller('token')
export class TokenController {
    constructor(private readonly tokenService: TokenService) { }

    @MessagePattern('token_create')
    public async createToken(params: { userId: string }): Promise<ITokenCreateResponse> {
        logger.info(`Received request to create Token for userId: ${params?.userId}`);

        if (!params?.userId) {
            logger.warn(`Missing userId in token creation request`);
            return {
                status: HttpStatus.BAD_REQUEST,
                system_message: 'token_create_bad_request',
                token: null,
                errors: null,
            };
        }

        try {
            const createResult = await this.tokenService.createToken(params.userId);
            logger.info(`Token created successfully for userId: ${params?.userId}`);

            return {
                status: HttpStatus.CREATED,
                system_message: 'token_create_success',
                token: createResult.token,
                errors: null,
            };
        } catch (error) {
            logger.error(`Error creating token`, { error: error.message, stack: error.stack });

            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                system_message: 'token_create_internal_error',
                token: null,
                errors: error.errors || error.message,
            };
        }
    }

    @MessagePattern('token_destroy')
    public async destroyToken(params: { userId: string }): Promise<ITokenDestroyResponse> {
        logger.info(`Received request to destroy Token for userId: ${params?.userId}`);

        if (!params?.userId) {
            logger.warn(`Missing userId in token destruction request`);
            return {
                status: HttpStatus.BAD_REQUEST,
                system_message: 'token_destroy_bad_request',
                errors: null,
            };
        }

        try {
            await this.tokenService.deleteTokenForUserId(params.userId);
            logger.info(`Token destroyed successfully for userId: ${params?.userId}`);

            return {
                status: HttpStatus.OK,
                system_message: 'token_destroy_success',
                errors: null,
            };
        } catch (error) {
            logger.error(`Error destroying token`, { error: error.message, stack: error.stack });

            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                system_message: 'token_destroy_internal_error',
                errors: error.errors || error.message,
            };
        }
    }

    @MessagePattern('token_decode')
    public async decodeToken(params: { token: string }): Promise<ITokenDecodeResponse> {
        logger.info(`Received request to decode Token`);

        if (!params?.token) {
            logger.warn(`Missing token in decode request`);
            return {
                status: HttpStatus.BAD_REQUEST,
                system_message: 'token_decode_bad_request',
                data: null,
                errors: null,
            };
        }

        try {
            const tokenData = await this.tokenService.decodeToken(params.token);

            if (!tokenData) {
                logger.warn(`Invalid token provided`);
                return {
                    status: HttpStatus.UNAUTHORIZED,
                    system_message: 'token_decode_unauthorized',
                    data: null,
                    errors: null,
                };
            }

            logger.info(`Token decoded successfully`);
            return {
                status: HttpStatus.OK,
                system_message: 'token_decode_success',
                data: tokenData,
                errors: null,
            };
        } catch (error) {
            logger.error(`Error decoding token`, { error: error.message, stack: error.stack });

            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                system_message: 'token_decode_internal_error',
                data: null,
                errors: error.errors || error.message,
            };
        }
    }
}