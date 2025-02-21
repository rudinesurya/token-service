import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { IToken } from '../interfaces/token.interface';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectModel('Token') private readonly tokenModel: Model<IToken>,
    ) { }

    public createToken(userId: string): Promise<IToken> {
        const token = this.jwtService.sign(
            {
                user_id: userId,
            },
            {
                expiresIn: 30 * 24 * 60 * 60,
            },
        );

        return new this.tokenModel({
            user_id: userId,
            token,
        }).save();
    }

    public deleteTokenForUserId(userId: string): Promise<any> {
        return this.tokenModel.deleteOne({
            user_id: userId,
        }).exec();
    }

    public async decodeToken(token: string) {
        const tokenModel = await this.tokenModel.findOne({
            token,
        }).exec();
        let result = null;

        if (tokenModel) {
            try {
                const tokenData = this.jwtService.decode(tokenModel.token) as {
                    exp: number;
                    user_id: any;
                };
                if (!tokenData || tokenData.exp <= Math.floor(+new Date() / 1000)) {
                    result = null;
                } else {
                    result = {
                        user_id: tokenData.user_id,
                    };
                }
            } catch (e) {
                result = null;
            }
        }
        return result;
    }
}